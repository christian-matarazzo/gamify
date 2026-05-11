const db = require('../config/db');
const nodemailer = require('nodemailer'); 


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function applyCoupon(couponCode, baseTotal, callback) {
  if (!couponCode || couponCode.trim() === '') {
    return callback(null, { discount: 0, couponId: null, finalTotal: baseTotal });
  }

  const findCouponQuery = `
    SELECT id, coupon_discount, expires_at, is_active
    FROM coupon 
    WHERE LOWER(coupon_name) = LOWER(?)
  `;

  db.query(findCouponQuery, [couponCode], function(err, results) {
    if (err || results.length === 0) {
      return callback(null, { discount: 0, couponId: null, finalTotal: baseTotal });
    }

    const coupon = results[0];
    const now = new Date();
    const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null;
    const isExpired = expiresAt && expiresAt < now;
    const isActive = coupon.is_active === 1;

    if (!isActive || isExpired) {
      return callback(null, { discount: 0, couponId: null, finalTotal: baseTotal });
    }

    const discountAmount = parseFloat(coupon.coupon_discount);
    const finalTotal = Math.max(0, baseTotal - discountAmount);

    callback(null, {
      discount: discountAmount,
      couponId: coupon.id,
      finalTotal: finalTotal
    });
  });
}


function reserveKeys(gameId, quantity, callback) {
  const countQuery = `
    SELECT COUNT(*) as available 
    FROM game_keys 
    WHERE game_id = ? AND status = 'available'
  `;

  db.query(countQuery, [gameId], function(err, countResult) {
    if (err) return callback(err);
    
    if (countResult[0].available < quantity) {
      return callback(new Error(`Only ${countResult[0].available} keys available for game ${gameId}`));
    }

    const selectKeysQuery = `
      SELECT id, license_key 
      FROM game_keys 
      WHERE game_id = ? AND status = 'available' 
      ORDER BY id ASC 
      LIMIT ?
    `;

    db.query(selectKeysQuery, [gameId, quantity], function(err, keyResults) {
      if (err) return callback(err);
      callback(null, keyResults);
    });
  });
}

const purchase = function(request, response) {
  const customerEmail = request.body.email;
  const items = request.body.items;
  const couponCode = request.body.coupon;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return response.status(400).json({
      success: false,
      message: 'At least one item is required'
    });
  }


  let baseTotal = 0;
  let finalTotal = 0;
  let discountAmount = 0;
  let couponId = null;
  const validatedItems = [];
  const reservedKeys = [];


  let processedCount = 0;
  const totalItems = items.length;

  function checkAllProcessed() {
    processedCount++;
    if (processedCount === totalItems) {
      proceedToCoupon();
    }
  }

  items.forEach((item, index) => {
    const { game_id, quantity } = item;

    if (!game_id || !quantity || quantity < 1) {
      return response.status(400).json({
        success: false,
        message: `Invalid item at index ${index}: game_id and quantity > 0 required`
      });
    }

    db.query('SELECT base_price FROM games WHERE id = ?', [game_id], function(err, gameResult) {
      if (err || gameResult.length === 0) {
        return response.status(404).json({
          success: false,
          message: `Game with id ${game_id} not found`
        });
      }

      const basePrice = parseFloat(gameResult[0].base_price);
      baseTotal += basePrice * quantity;
      
      validatedItems.push({ game_id, quantity, base_price: basePrice });
      checkAllProcessed();
    });
  });

  function proceedToCoupon() {
    applyCoupon(couponCode, baseTotal, function(err, couponData) {
      if (err) {
        console.error('Coupon error:', err);
        return response.status(500).json({ success: false, message: 'Failed to apply coupon' });
      }


      discountAmount = couponData.discount;
      couponId = couponData.couponId;
      finalTotal = couponData.finalTotal;

    
      let reservedCount = 0;

      function checkAllReserved() {
        reservedCount++;
        if (reservedCount === validatedItems.length) {
          proceedToCreateOrder();
        }
      }

      validatedItems.forEach((item) => {
        reserveKeys(item.game_id, item.quantity, function(err, keys) {
          if (err) {
            return response.status(400).json({
              success: false,
              message: `Failed to reserve keys: ${err.message}`
            });
          }

          keys.forEach(key => {
            reservedKeys.push({
              game_id: item.game_id,
              key_id: key.id,
              license_key: key.license_key,
              sold_price: item.base_price
            });
          });
          checkAllReserved();
        });
      });
    });
  }

  function proceedToCreateOrder() {
    db.getConnection(function(connErr, conn) {
      if (connErr) {
        console.error('Connection error:', connErr);
        return response.status(500).json({ success: false, message: 'Database connection failed' });
      }

      conn.beginTransaction(function(txErr) {
        if (txErr) {
          conn.release();
          return response.status(500).json({ success: false, message: 'Transaction start failed' });
        }

        const insertOrderQuery = `
          INSERT INTO orders (email, total_amount, discount_amount, coupon_id) 
          VALUES (?, ?, ?, ?)
        `;
        
        conn.query(
          insertOrderQuery,
          [customerEmail, finalTotal, discountAmount, couponId],
          function(orderErr, orderResult) {
            if (orderErr) {
              conn.rollback(() => conn.release());
              return response.status(500).json({ success: false, message: 'Failed to create order' });
            }

            const newOrderId = orderResult.insertId;

      
            let itemsInserted = 0;

            function checkAllItemsInserted() {
              itemsInserted++;
              if (itemsInserted === reservedKeys.length) {
    
                let keysUpdated = 0;

                function checkAllKeysUpdated() {
                  keysUpdated++;
                  if (keysUpdated === reservedKeys.length) {

                    conn.commit(function(commitErr) {
                      conn.release();
                      
                      if (commitErr) {
                        return response.status(500).json({ success: false, message: 'Failed to confirm order' });
                      }
                      const customerMailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: customerEmail,
                        subject: `🎮 Order #${newOrderId} Confirmed - Your License Keys`,
                        text: `
Thank you for your order!

Order ID: ${newOrderId}
Date: ${new Date().toLocaleString('it-IT')}

Your license keys:
${reservedKeys.map((k, i) => `${i + 1}. ${k.license_key}`).join('\n')}

Total items: ${reservedKeys.length}
Amount paid: ${finalTotal}€
Discount applied: ${discountAmount}€

Save these keys in a safe place.
-- Gamify Team
                        `,
                        html: `
                          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #0d6efd;">✅ Order Confirmed!</h2>
                            <p>Thank you for your purchase, <strong>${customerEmail}</strong>.</p>
                            
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${newOrderId}</p>
                              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString('it-IT')}</p>
                            </div>

                            <h3 style="margin-top: 30px;">Your License Keys</h3>
                            ${reservedKeys.map((k, i) => `
                              <div style="background: #fff3cd; padding: 10px 15px; margin: 10px 0; border-radius: 4px; font-family: monospace; font-size: 14px;">
                                ${i + 1}. ${k.license_key}
                              </div>
                            `).join('')}

                            <div style="margin-top: 30px; padding: 15px; background: #e7f1ff; border-radius: 6px;">
                              <p style="margin: 5px 0;"><strong>Total items:</strong> ${reservedKeys.length}</p>
                              <p style="margin: 5px 0;"><strong>Amount paid:</strong> ${finalTotal}€</p>
                              <p style="margin: 5px 0;"><strong>Discount:</strong> ${discountAmount}€</p>
                            </div>

                            <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
                              Save these keys in a safe place.<br>
                              -- Gamify Team
                            </p>
                          </div>
                        `
                      };

                      transporter.sendMail(customerMailOptions, function(customerMailError, customerMailInfo) {
                        if (customerMailError) {
                          console.error('❌ Customer email send error:', customerMailError.message);
                        } else {
                          console.log('✅ Customer email sent:', customerMailInfo.messageId);
                        }
                      });

                      const sellerMailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: process.env.SELLER_EMAIL,
                        subject: `🎮 New Order #${newOrderId} - ${customerEmail}`,
                        text: `
New order received!

Order ID: ${newOrderId}
Customer: ${customerEmail}
Date: ${new Date().toLocaleString('it-IT')}

Items sold:
${reservedKeys.map((k, i) => 
  `${i + 1}. Game ID: ${k.game_id} | Key: ${k.license_key} | Price: ${k.sold_price}€`
).join('\n')}

Total items: ${reservedKeys.length}
Total amount: ${finalTotal}€
Discount applied: ${discountAmount}€
Coupon used: ${couponCode || 'None'}

-- Gamify Admin Panel
                        `,
                        html: `
                          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <h2 style="color: #0d6efd;">🎮 New Order Received</h2>
                            
                            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                              <tr><td style="padding: 8px 0;"><strong>Order ID:</strong></td><td>#${newOrderId}</td></tr>
                              <tr><td style="padding: 8px 0;"><strong>Customer:</strong></td><td>${customerEmail}</td></tr>
                              <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${new Date().toLocaleString('it-IT')}</td></tr>
                            </table>

                            <h3 style="margin-top: 30px; color: #343a40;">Items Sold</h3>
                            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                              <thead>
                                <tr style="background: #f8f9fa;">
                                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">#</th>
                                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Game ID</th>
                                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">License Key</th>
                                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${reservedKeys.map((k, i) => `
                                  <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${i + 1}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${k.game_id}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-family: monospace; font-size: 12px;">${k.license_key}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">${k.sold_price}€</td>
                                  </tr>
                                `).join('')}
                              </tbody>
                            </table>

                            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                              <p style="margin: 5px 0;"><strong>Total items:</strong> ${reservedKeys.length}</p>
                              <p style="margin: 5px 0;"><strong>Total amount:</strong> ${finalTotal}€</p>
                              <p style="margin: 5px 0;"><strong>Discount:</strong> ${discountAmount}€</p>
                              <p style="margin: 5px 0;"><strong>Coupon:</strong> ${couponCode || 'None'}</p>
                            </div>

                            <p style="margin-top: 30px; color: #6c757d; font-size: 14px; border-top: 1px solid #dee2e6; padding-top: 20px;">
                              -- Gamify Admin Panel
                            </p>
                          </div>
                        `
                      };

                      transporter.sendMail(sellerMailOptions, function(sellerMailError, sellerMailInfo) {
                        if (sellerMailError) {
                          console.error('❌ Seller email send error:', sellerMailError.message);
        
                        } else {
                          console.log('✅ Seller email sent:', sellerMailInfo.messageId);
                        }
                      });

        
                      const licenseKeys = reservedKeys.map(k => k.license_key);

                      response.json({
                        success: true,
                        order_id: newOrderId,
                        license_keys: licenseKeys,
                        total_items: reservedKeys.length,
                        price_paid: finalTotal,
                        discount_applied: discountAmount,
                        coupon_used: couponCode && couponCode.trim() !== '' ? couponCode : null,
                        message: 'Purchase completed successfully'
                      });

                    });
                  }
                }

                reservedKeys.forEach((keyData) => {
                  conn.query(
                    "UPDATE game_keys SET status = 'sold' WHERE id = ?",
                    [keyData.key_id],
                    function(updateErr) {
                      if (updateErr) {
                        conn.rollback(() => conn.release());
                        return response.status(500).json({ success: false, message: 'Failed to update key status' });
                      }
                      checkAllKeysUpdated();
                    }
                  );
                });
              }
            }

            reservedKeys.forEach((keyData) => {
              conn.query(
                `INSERT INTO order_items (order_id, game_key_id, sold_price) VALUES (?, ?, ?)`,
                [newOrderId, keyData.key_id, keyData.sold_price],
                function(itemErr) {
                  if (itemErr) {
                    conn.rollback(() => conn.release());
                    return response.status(500).json({ success: false, message: 'Failed to link order item' });
                  }
                  checkAllItemsInserted();
                }
              );
            });
          }
        );
      });
    });
  }
};

module.exports = { purchase, applyCoupon: applyCoupon};