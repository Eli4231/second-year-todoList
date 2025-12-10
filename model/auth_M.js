
const db = require('../config/db_config');

async function addUserToDB({ name, email, userName, pass }) {
    const sql = 'INSERT INTO users (name, email, useName, pass) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [name, email, userName, pass]);
    return { id: result.insertId, name, email, userName };
}

async function getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
}

async function getUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
}

async function getUserByUserName(userName) {
    const sql = 'SELECT * FROM users WHERE useName = ?';
    const [rows] = await db.query(sql, [userName]);
    return rows.length > 0 ? rows[0] : null;
}

module.exports = { addUserToDB, getUserByEmail, getUserById, getUserByUserName };
