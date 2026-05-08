const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* buy a key endpoint */
router.post("/purchase", function (request, response) {
  /* take front end data from request */
  const customerEmail = request.body.email;
  const gameId = request.body.game_id;
  const couponCode = request.body.coupon;

  /* 1. find 1 key if available */
  const findKeyQuery = `
    SELECT id, license_key 
    FROM game_keys 
    WHERE game_id = ? AND status = 'available' 
    LIMIT 1
  `;

  db.query(findKeyQuery, [gameId], function (error, keyResults) {
    if (error) {
      console.error("Error searching for key:", error);
      return response
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (keyResults.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No keys available for this game",
      });
    }

    const foundKey = keyResults[0];

    /* 2. take the game price without discount */
    db.query(
      "SELECT base_price FROM games WHERE id = ?",
      [gameId],
      function (priceError, gameResults) {
        if (priceError) {
          console.error("Error getting game price:", priceError);
          return response
            .status(500)
            .json({ success: false, message: "Failed to get price" });
        }

        const basePrice = gameResults[0].base_price;

        /* 3. check coupon from database */
        let discountAmount = 0;
        let couponId = null;
        let finalPrice = basePrice;

        if (couponCode && couponCode.trim() !== "") {
          const findCouponQuery = `
          SELECT id, coupon_discount 
          FROM coupon 
          WHERE LOWER(coupon_name) = LOWER(?)
        `;

          db.query(
            findCouponQuery,
            [couponCode],
            function (couponError, couponResults) {
              // If coupon exists, apply discount. If query fails or code invalid, proceed with 0 discount.
              if (!couponError && couponResults.length > 0) {
                discountAmount = couponResults[0].coupon_discount;
                couponId = couponResults[0].id;
                finalPrice = basePrice - discountAmount;
                if (finalPrice < 0) finalPrice = 0;
              }
              proceedToCreateOrder();
            },
          );
        } else {
          proceedToCreateOrder();
        }

        /* 4. continue with order creation */
        function proceedToCreateOrder() {
          const insertOrderQuery = `
          INSERT INTO orders (email, total_amount, coupon_id, discount_amount) 
          VALUES (?, ?, ?, ?)
        `;

          db.query(
            insertOrderQuery,
            [customerEmail, finalPrice, couponId, discountAmount],
            function (orderError, orderResult) {
              if (orderError) {
                console.error("Error creating order:", orderError);
                return response
                  .status(500)
                  .json({ success: false, message: "Failed to create order" });
              }

              const newOrderId = orderResult.insertId;

              /* 5. connect the key with the order in the table order_items */
              const insertItemQuery = `
            INSERT INTO order_items (order_id, game_key_id, sold_price) 
            VALUES (?, ?, ?)
          `;
              db.query(
                insertItemQuery,
                [newOrderId, foundKey.id, finalPrice],
                function (itemError) {
                  if (itemError) {
                    console.error("Error linking order item:", itemError);
                    return response
                      .status(500)
                      .json({ success: false, message: "Failed to link item" });
                  }

                  /* 6. change backend status value from available to sold */
                  const updateKeyQuery =
                    "UPDATE game_keys SET status = 'sold' WHERE id = ?";
                  db.query(
                    updateKeyQuery,
                    [foundKey.id],
                    function (updateError) {
                      if (updateError) {
                        console.error(
                          "Error updating key status:",
                          updateError,
                        );
                        return response.status(500).json({
                          success: false,
                          message: "Failed to update key",
                        });
                      }

                      /* send json with the key if success */
                      response.json({
                        success: true,
                        order_id: newOrderId,
                        license_key: foundKey.license_key,
                        price_paid: finalPrice,
                        discount_applied: discountAmount,/* check discount */
                        coupon_used:
                          couponCode && couponCode.trim() !== ""
                            ? couponCode
                            : null,
                        message: "Purchase completed successfully",
                      });
                    },
                  );
                },
              );
            },
          );
        }
      },
    );
  });
});

module.exports = router;
