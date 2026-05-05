const connection = require('../config/db')

function index(req, res) {
  const sql = 'SELECT * FROM games';
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Errore SQL:', err);
      return res.status(500).json({ error: 'Errore database', message: err.message });
    }
    res.json({ success: true,  results });
  });
}

module.exports = { index };
