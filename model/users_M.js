const db = require('../config/db_config');

async function getAllUsersFromDB(){
    const sql = 'SELECT id,name,email FROM users';
    console.log(sql);
    let [rows] = await db.query(sql);
    
    console.log(rows);

    return rows;
    
}

async function getUserByIdFromDB(id){
    const sql = 'SELECT id,name,email FROM users WHERE id = ?';
    console.log(sql);
    let [rows] = await db.query(sql, [id]);
    
    console.log(rows);

    return rows;
    
}
async function deleteUserFromDB(id){
    const sql = 'DELETE FROM users WHERE id = ?';
    console.log(sql);
    let [rows] = await db.query(sql, [id]);
    console.log(rows);
    return rows;
}

module.exports = {getAllUsersFromDB, getUserByIdFromDB};