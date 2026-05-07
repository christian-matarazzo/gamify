const express = require('express');
const router = express.Router();
const db = require('../config/db'); // ← la connessione con callback

// POST endpoint: acquista una chiave gioco
router.post('/purchase', function(request, response) {
  
  // 1. Prendi i dati dal frontend
  const customerEmail = request.body.email;
  const gameId = request.body.game_id;
  const couponCode = request.body.coupon;

  // 2. Trova UNA chiave disponibile per questo gioco
  const findKeyQuery = `
    SELECT id, license_key 
    FROM game_keys 
    WHERE game_id = ? AND status = 'available' 
    LIMIT 1
  `;

  db.query(findKeyQuery, [gameId], function(error, keyResults) {
    if (error) {
      console.error('Error searching for key:', error);
      return response.status(500).json({ success: false, message: 'Database error' });
    }

    if (keyResults.length === 0) {
      return response.status(400).json({ 
        success: false, 
        message: 'No keys available for this game' 
      });
    }

    const foundKey = keyResults[0];

    // 3. Prendi il prezzo base del gioco
    const findPriceQuery = 'SELECT base_price FROM games WHERE id = ?';
    db.query(findPriceQuery, [gameId], function(priceError, gameResults) {
      if (priceError) {
        console.error('Error getting game price:', priceError);
        return response.status(500).json({ success: false, message: 'Failed to get price' });
      }

      const basePrice = gameResults[0].base_price;

      // 4. Applica lo sconto coupon (se presente)
      let discountAmount = 0;
      let finalPrice = basePrice;

      if (couponCode === 'WELCOME10' && basePrice >= 10) {
        discountAmount = 10;
        finalPrice = basePrice - discountAmount;
      }
      if (finalPrice < 0) finalPrice = 0;

      // 5. Crea l'ordine nella tabella orders
      const insertOrderQuery = `
        INSERT INTO orders (email, total_amount, coupon_discount_amount) 
        VALUES (?, ?, ?)
      `;
      db.query(
        insertOrderQuery, 
        [customerEmail, finalPrice, discountAmount], 
        function(orderError, orderResult) {
          if (orderError) {
            console.error('Error creating order:', orderError);
            return response.status(500).json({ success: false, message: 'Failed to create order' });
          }

          const newOrderId = orderResult.insertId;

          // 6. Collega la chiave all'ordine nella tabella order_items
          const insertItemQuery = `
            INSERT INTO order_items (order_id, game_key_id, sold_price) 
            VALUES (?, ?, ?)
          `;
          db.query(
            insertItemQuery, 
            [newOrderId, foundKey.id, finalPrice], 
            function(itemError) {
              if (itemError) {
                console.error('Error linking order item:', itemError);
                return response.status(500).json({ success: false, message: 'Failed to link item' });
              }

              // 7. Cambia lo stato della chiave da available a sold
              const updateKeyQuery = "UPDATE game_keys SET status = 'sold' WHERE id = ?";
              db.query(updateKeyQuery, [foundKey.id], function(updateError) {
                if (updateError) {
                  console.error('Error updating key status:', updateError);
                  return response.status(500).json({ success: false, message: 'Failed to update key' });
                }

                // 8. Rispondi al frontend con la chiave acquistata
                response.json({
                  success: true,
                  order_id: newOrderId,
                  license_key: foundKey.license_key,
                  price_paid: finalPrice,
                  message: 'Purchase completed successfully'
                });
              });
            }
          );
        }
      );
    });
  });
});

module.exports = router;
