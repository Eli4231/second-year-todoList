
const db = require('../config/db_config');

async function addUserToDB({ name, email, userName, pass }) {
    const sql = 'INSERT INTO users (name, email, useName, pass) VALUES (?, ?, ?, ?)';
    console.log(sql);
    const [result] = await db.query(sql, [name, email, userName, pass]);
    console.log(result);
    return { id: result.insertId, name, email, userName };
}

async function getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    console.log(sql);
    const [rows] = await db.query(sql, [email]);
    console.log(rows);
    return rows.length > 0 ? rows[0] : null;
}

async function getUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    console.log(sql);
    const [rows] = await db.query(sql, [id]);
    console.log(rows);
    return rows.length > 0 ? rows[0] : null;
}

async function getUserByUserName(userName) {
    const sql = 'SELECT * FROM users WHERE useName = ?';
    console.log(sql);
    const [rows] = await db.query(sql, [userName]);
    console.log(rows);
    return rows.length > 0 ? rows[0] : null;
}

module.exports = { addUserToDB, getUserByEmail, getUserById, getUserByUserName };
