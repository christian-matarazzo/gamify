require('dotenv').config();
const mysql = require('mysql2'); // ← versione callback (NON /promise)

/* Crea un POOL di connessioni invece di una singola */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gamify_db',
  waitForConnections: true,
  connectionLimit: 10,  // Max connessioni simultanee
  queueLimit: 0         // Nessun limite alla coda di richieste
});

/* Test connessione (opzionale ma utile) */
pool.getConnection(function (err, connection) {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database!');
  connection.release(); // Rilascia la connessione al pool
});

/* Esporta il pool */
module.exports = pool;