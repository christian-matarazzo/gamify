
const db = require('../config/db');

const createTicket = function (req, res) {
  const { email, subject, message, order_id, priority = 'medium' } = req.body;


  if (!email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: email, subject, and message are required'
    });
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  
  if (subject.trim().length = 0) {
    return res.status(400).json({
      success: false,
      message: 'No Subject'
    });
  }

  if (message.trim().length = 0) {
    return res.status(400).json({
      success: false,
      message: 'No message'
    });
  }

 
  const validPriorities = ['low', 'medium', 'high'];
  const ticketPriority = validPriorities.includes(priority) ? priority : 'medium';


  const ticketData = {
    user_email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    status: 'open',                    
    priority: ticketPriority,
    order_id: order_id || null        
  };


  const insertQuery = `
    INSERT INTO support_tickets 
    (user_email, subject, message, status, priority, order_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    ticketData.user_email,
    ticketData.subject,
    ticketData.message,
    ticketData.status,
    ticketData.priority,
    ticketData.order_id
  ];

  db.query(insertQuery, values, function (err, result) {
    if (err) {
      console.error('❌ Error creating support ticket:', err);


      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Invalid order_id: the specified order does not exist'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create support ticket. Please try again later.'
      });
    }

 
    console.log(`✅ Support ticket #${result.insertId} created for ${ticketData.user_email}`);



    res.json({
      success: true,
      ticket_id: result.insertId,
      message: 'Support ticket created successfully. We will reply within 24-48 hours.',
      status: ticketData.status,
      priority: ticketData.priority
    });
  });
};


const getTicketsByEmail = function (req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email parameter is required'
    });
  }

  const query = `
    SELECT id, subject, status, priority, created_at, updated_at
    FROM support_tickets
    WHERE user_email = ?
    ORDER BY created_at DESC
    LIMIT 50
  `;

  db.query(query, [email.trim().toLowerCase()], function (err, results) {
    if (err) {
      console.error('❌ Error fetching tickets:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch support tickets'
      });
    }

    res.json({
      success: true,
      count: results.length,
      tickets: results
    });
  });
};


const updateTicketStatus = function (req, res) {
  const { ticket_id } = req.params;
  const { status, admin_note } = req.body;

  const validStatuses = ['open', 'pending', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value'
    });
  }

  const query = `
    UPDATE support_tickets 
    SET status = ?, updated_at = CURRENT_TIMESTAMP${status === 'resolved' ? ', resolved_at = CURRENT_TIMESTAMP' : ''}
    WHERE id = ?
  `;

  db.query(query, [status, ticket_id], function (err, result) {
    if (err) {
      console.error('❌ Error updating ticket:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update ticket status'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      message: `Ticket #${ticket_id} status updated to "${status}"`
    });
  });
};

module.exports = {
  createTicket,
  getTicketsByEmail,    
  updateTicketStatus      
};