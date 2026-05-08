require('dotenv').config()
const mysql = require('mysql2');
/* DB DATA WITH ENVIROMENT VARIABLES*/
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



connection.connect((err) => {
  if (err) {
    console.error('Error to connect:', err.message);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = connection;