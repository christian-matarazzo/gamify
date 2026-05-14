// backend/routes/support.js
const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// ✅ POST /api/support/ticket - Crea nuovo ticket (matching frontend)
router.post('/ticket', supportController.createTicket);

// ✅ GET /api/support/tickets?email=... - Recupera ticket utente (opzionale)
router.get('/tickets', supportController.getTicketsByEmail);

// ✅ PATCH /api/support/ticket/:ticket_id - Aggiorna stato (per admin futuro)
router.patch('/ticket/:ticket_id', supportController.updateTicketStatus);

module.exports = router;