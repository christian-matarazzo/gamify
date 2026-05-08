const connection = require('../config/db')

function index(req, res) {
 const sql = "SELECT *, DATE_FORMAT(release_date, '%Y-%m-%d') AS release_date FROM games";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Errore SQL:', err);
      return res.status(500).json({ error: 'Errore database', message: err.message });
    }
    res.json({ success: true, results });
  });
}

function show(req, res) {
  const slug = req.params.slug;
  const sql = "SELECT *, DATE_FORMAT(release_date, '%Y-%m-%d') AS release_date FROM games WHERE slug=?";

  connection.query(sql, [slug], (err, results) => {
    if (err) {
      console.error('Errore SQL:', err);
      return res.status(500).json({ error: 'Errore database', message: 'game not foun' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Gioco non trovato' });
    }
    res.json({ success: true, results: results[0] })
  })
}


module.exports = { index, show };
