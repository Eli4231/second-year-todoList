const{getAllUsersFromDB, getUserByIdFromDB, deleteUserFromDB, updateUserFromDB} = require('../model/users_M');



async function getAllUsers(req, res){
    try {
       let users = await getAllUsersFromDB();
       if(users.length == 0){
        res.status(200).json({message: "no users found"});
       }else{
        res.status(200).json({message: "ok", users});
       }

    } catch (error) {
        console.log('ERROR in getAllUsers:', error.message);
        res.status(500).json({message: "error", details: error.message});
    }
}


async function getUserById(req, res){
    try {
        const users = await getUserByIdFromDB(req.params.id);
       
        if(!users || users.length === 0){
            res.status(404).json({message: `user id ${req.params.id} not found`});
            return;
        }
        const user = users[0];
        res.status(200).json({message: "ok", user});
    } catch (error) {
        console.log('ERROR in getUserById:', error.message);
        res.status(500).json({message: "error", details: error.message});
    }
}

async function deleteUser(req, res){
    try {
        const affectedRows = await deleteUserFromDB(req.params.id);
        if(!affectedRows || affectedRows === 0){
            res.status(404).json({message: `user id ${req.params.id} not found`});
            return;
        }
        res.status(200).json({message: "user deleted successfully"});
    } catch (error) {
        console.log('ERROR in deleteUser:', error.message);
        res.status(500).json({message: "error", details: error.message});
    }
}
async function updateUser(req, res){
    try {
        const affectedRows = await updateUserFromDB(req.params.id, req.updateFields);
        if(!affectedRows || affectedRows === 0){
            res.status(404).json({message: `user id ${req.params.id} not found or no changes made`});
            return;
        }
        res.status(200).json({message: "user updated successfully"});
    } catch (error) {
        console.log('ERROR in updateUser:', error.message);
        res.status(500).json({message: "error", details: error.message});
    }
}

async function getCurrentUser(req, res) {
    try {
        const userId = req.user.id;
        const users = await getUserByIdFromDB(userId);
       
        if(!users || users.length === 0){
            res.status(404).json({message: "user not found"});
            return;
        }
        const user = users[0];
        // Don't send password
        const { pass, ...safeUser } = user;
        res.status(200).json({message: "ok", user: safeUser});
    } catch (error) {
        console.log('ERROR in getCurrentUser:', error.message);
        res.status(500).json({message: "error", details: error.message});
    }
}


module.exports = {getAllUsers, getUserById, deleteUser, updateUser, getCurrentUser};