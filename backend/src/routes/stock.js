

const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/check', function(request, response) {
    const { items } = request.body;
    
    stockController.checkStockAvailability(items, function(error, result) {
        if (error) {
            console.error('Errore nel controller stock:', error);
            return response.status(500).json({
                success: false,
                message: 'Internal server error while checking availability',
                unavailable: []
            });
        }

        if (!result.success) {
            return response.status(200).json(result);
        }
        

        response.status(200).json(result);
    });
});

module.exports = router;