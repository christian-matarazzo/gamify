const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/ticket', supportController.createTicket);

router.get('/tickets', supportController.getTicketsByEmail);

router.patch('/ticket/:ticket_id', supportController.updateTicketStatus);

module.exports = router;