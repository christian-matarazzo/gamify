const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');


router.post('/purchase', ordersController.purchase);

module.exports = router;