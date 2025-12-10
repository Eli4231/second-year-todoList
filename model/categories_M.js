const db = require('../config/db_config');

async function getAllCategoriesFromDB() {
    const sql = 'SELECT * FROM categories';
    const [rows] = await db.query(sql);
    return rows;
}

async function getCategoryByIdFromDB(id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const [rows] = await db.query(sql, [id]);
    return rows;
}

async function deleteCategoryFromDB(id) {
    const sql = 'DELETE FROM categories WHERE id = ?';
    const [rows] = await db.query(sql, [id]);
    return rows.affectedRows;
}

module.exports = { getAllCategoriesFromDB, getCategoryByIdFromDB, deleteCategoryFromDB };
