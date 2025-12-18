const db = require('../config/db_config');

async function getAllTasksFromDB(users_id) {
    const sql = 'SELECT id, text, is_done, category_id, users_id FROM tasks WHERE users_id = ?';
    const [rows] = await db.query(sql, [users_id]);
    return rows;
}

async function getTaskByIdFromDB(id, users_id) {
    const sql = 'SELECT id, text, is_done, category_id, users_id FROM tasks WHERE id = ? AND users_id = ?';
    const [rows] = await db.query(sql, [id, users_id]);
    return rows;
}

async function addTaskToDB({ text, is_done, category_id }, users_id) {
    const sql = 'INSERT INTO tasks (text, is_done, category_id, users_id) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [text, is_done, category_id, users_id]);
    return { id: result.insertId, text, is_done, category_id, users_id };
}

module.exports = { getAllTasksFromDB, getTaskByIdFromDB, addTaskToDB };