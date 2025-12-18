const db = require('../config/db_config');

async function getAllCategoriesFromDB(user_id) {
    const sql = 'SELECT * FROM categories WHERE user_id = ?';
    const [rows] = await db.query(sql, [user_id]);
    return rows;
}

async function getCategoryByIdFromDB(id, user_id) {
    const sql = 'SELECT * FROM categories WHERE id = ? AND user_id = ?';
    const [rows] = await db.query(sql, [id, user_id]);
    return rows;
}

async function deleteCategoryFromDB(id, user_id) {
    const sql = 'DELETE FROM categories WHERE id = ? AND user_id = ?';
    const [rows] = await db.query(sql, [id, user_id]);
    return rows.affectedRows;
}

async function addCategoryToDB({ name, user_id }) {
    const sql = 'INSERT INTO categories (name, user_id) VALUES (?, ?)';
    const [result] = await db.query(sql, [name, user_id]);
    return { id: result.insertId, name, user_id };
}

async function updateCategoryInDB(id, user_id, name ) {
    const sql = 'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?';
    const [rows] = await db.query(sql, [name, id, user_id]);
    return rows.affectedRows; 
}
module.exports = { getAllCategoriesFromDB, getCategoryByIdFromDB, deleteCategoryFromDB, addCategoryToDB, updateCategoryInDB };


