const connection = require('../config/db');

function search(req, res) {
  try {
    const { query = '', sort = 'title' } = req.query;

    let sql = "SELECT *, DATE_FORMAT(release_date, '%Y-%m-%d') AS release_date FROM games WHERE 1=1";
    const values = [];
    if (query && query.trim() !== '') {
      sql += " AND title LIKE ?";
      values.push(`%${query.trim()}%`);
    }

    const sortMap = {
      'title': 'title ASC',
      'release_newer': 'release_date DESC',
      'release_older': 'release_date ASC',
      'higher_price': 'base_price DESC',
      'lower_price': 'base_price ASC'
    };
    
    const orderBy = sortMap[sort] || 'title ASC';
    sql += ` ORDER BY ${orderBy}`;

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('❌ SQL Error in search:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error', 
          message: err.sqlMessage || err.message 
        });
      }
      
      res.json({ 
        success: true, 
        results,
        meta: { count: results.length, filters: { query, sort } }
      });
    });
  } catch (error) {
    console.error('❌ Controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error', 
      message: 'Errore interno durante la ricerca' 
    });
  }
}

function index(req, res) {
  const sql = "SELECT *, DATE_FORMAT(release_date, '%Y-%m-%d') AS release_date FROM games";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ SQL Error in index:', err);
      return res.status(500).json({ success: false, error: 'Database error', message: err.message });
    }
    res.json({ success: true, results });
  });
}

function show(req, res) {
  const slug = req.params.slug;
  const sql = "SELECT *, DATE_FORMAT(release_date, '%Y-%m-%d') AS release_date FROM games WHERE slug=?";
  connection.query(sql, [slug], (err, results) => {
    if (err) {
      console.error('❌ SQL Error in show:', err);
      return res.status(500).json({ success: false, error: 'Database error', message: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Not Found', message: 'Gioco non trovato' });
    }
    res.json({ success: true, results: results[0] });
  });
}

module.exports = { index, show, search };