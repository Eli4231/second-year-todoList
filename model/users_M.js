const db = require('../config/db_config');

async function getAllUsersFromDB(){
    const sql = 'SELECT id,name,email,useName FROM users';
    const [rows] = await db.query(sql);
    return rows;
}

async function getUserByIdFromDB(id){
    const sql = 'SELECT id,name,email,useName FROM users WHERE id = ?';
    const [rows] = await db.query(sql, [id]);
    return rows;
}
async function deleteUserFromDB(id){
    const sql = 'DELETE FROM users WHERE id = ?';
    const [rows] = await db.query(sql, [id]);
    return rows.affectedRows;
}

async function updateUserFromDB(id, user){
    const allowedFields = ['name', 'email'];
    const fields = [];
    const values = [];

    allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(user, field)) {
            fields.push(`${field} = ?`);
            values.push(user[field]);
        }
    });

    if (fields.length === 0) {
        return 0;
    }

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const [rows] = await db.query(sql, [...values, id]);
    return rows.affectedRows;
}

module.exports = {getAllUsersFromDB, getUserByIdFromDB, deleteUserFromDB, updateUserFromDB};