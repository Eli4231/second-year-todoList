const db = require('../config/db_config');

async function getAllTasksFromDB(users_id) {
    const sql = 'SELECT id, description, isDone, category_id, user_id FROM tasks WHERE user_id = ?';
    const [rows] = await db.query(sql, [users_id]);
    return rows;
}

async function getTaskByIdFromDB(id, users_id) {
    const sql = 'SELECT id, description, isDone, category_id, user_id FROM tasks WHERE id = ? AND user_id = ?';
    const [rows] = await db.query(sql, [id, users_id]);
    return rows;
}

async function addTaskToDB({ description, isDone, category_id }, users_id) {
    const sql = 'INSERT INTO tasks (description, isDone, category_id, user_id) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [description, isDone, category_id, users_id]);
    return { id: result.insertId, description, isDone, category_id, user_id: users_id };
}

async function deleteTaskFromDB(id, users_id) {
    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    const [result] = await db.query(sql, [id, users_id]);
    return result.affectedRows;
}

module.exports = { getAllTasksFromDB, getTaskByIdFromDB, addTaskToDB, deleteTaskFromDB };