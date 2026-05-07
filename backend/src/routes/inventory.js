const express = require('express');
const router = express.Router();
const connection = require('../config/db');

/* conteggio dei giochi e delle chiavi disponibili per ogni gioco */
router.get('/', function(req, res) {
  const sqlQuery = `
    SELECT 
      games.id, 
      games.title, 
      games.slug, 
      games.base_price, 
      games.image_url,
      COUNT(game_keys.id) AS total_keys,
      SUM(CASE WHEN game_keys.status = 'available' THEN 1 ELSE 0 END) AS available_keys
    FROM games
    LEFT JOIN game_keys ON games.id = game_keys.game_id
    GROUP BY games.id, games.title, games.slug, games.base_price, games.image_url
    ORDER BY games.title ASC
  `;

  connection.query(sqlQuery, function(err, results) {
    if (err) {
      console.error('Error inventory:', err);
      return res.status(500).json({ success: false, message: 'Error inventory' });
    }
    res.json({ success: true, data: results });
  });
});

module.exports = router;