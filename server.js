const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'firework4412',
    database: 'business_db',
    //waitForConnections: true,
    //connectionLimit: 10,
    //queueLimit: 0,
  });

// Queries to be inserted here as pool
