const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'gamify_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error to connect:', err.message);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = connection;