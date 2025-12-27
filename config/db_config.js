const mysql = require('mysql2');
require('dotenv').config();

// Debug current DB config (ללא סיסמה) כדי לוודא שהערכים נכונים
const dbConfig = {
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.DB_USER,
    // לא מדפיסים סיסמה ללוגים
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true
};

console.log('DB config (without password):', dbConfig);

const pool = mysql.createPool({
    ...dbConfig,
    password: process.env.DB_PASS
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        console.error('Full DB error:', err);
        return;
    }
    console.log('Connected to the database');
    connection.release();
});

module.exports = pool.promise();