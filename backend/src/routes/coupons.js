const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { applyCoupon } = require('../controllers/ordersController');


router.post('/validate', function(request, response) {
    const couponCode = request.body.couponCode;
    const cartTotal = request.body.cartTotal;
    
    if (!couponCode || !cartTotal) {
        return response.status(400).json({ 
            success: false, 
            message: 'Coupon code and cart total are required' 
        });
    }
    
    applyCoupon(couponCode, cartTotal, function(error, result) {
        if (error) {
            return response.status(500).json({ 
                success: false, 
                message: 'Validation failed' 
            });
        }
        
        if (result.discount === 0) {
            return response.json({
                success: false,
                message: 'Coupon not valid or expired'
            });
        }
        
        response.json({
            success: true,
            message: 'Coupon applied successfully',
            discountAmount: result.discount,
            finalTotal: result.finalTotal,
            couponId: result.couponId
        });
    });
});

module.exports = router;