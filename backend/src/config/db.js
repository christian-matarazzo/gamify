<<<<<<< HEAD
require('dotenv').config()
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
=======
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
>>>>>>> 2d43c6880020867b0bb87d37b04fba02bd6eebb0
});

connection.connect((err) => {
  if (err) {
    console.error('Error to connect:', err.message);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = connection;
<<<<<<< HEAD

=======
>>>>>>> 2d43c6880020867b0bb87d37b04fba02bd6eebb0
