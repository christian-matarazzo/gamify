require('dotenv').config();
const mysql = require('mysql2'); 

// Configurazione flessibile per locale e Cloud (Railway)
const poolConfig = process.env.MYSQL_URL 
  ? process.env.MYSQL_URL // Se siamo su Railway, usa questa stringa magica
  : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gamify_db',
      waitForConnections: true,
      connectionLimit: 10, 
      queueLimit: 0        
    };

const pool = mysql.createPool(poolConfig);

// Test di connessione automatico all'avvio
pool.getConnection(function (err, connection) {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database!');
  connection.release();
});

module.exports = pool;