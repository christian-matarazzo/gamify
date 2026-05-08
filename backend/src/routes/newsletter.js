const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

/* POST endpoint: chiama solo il controller */
router.post('/subscribe', newsletterController.subscribe);

module.exports = router;