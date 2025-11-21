const{getAllUsersFromDB, getUserByIdFromDB, deleteUserFromDB, updateUserFromDB} = require('../model/users_M');



async function getAllUsers(req, res){
    try {
       let users=await getAllUsersFromDB();
       if(users.length == 0){
        res.status(200).json({message: "no users found"});
       }else{
        res.status(200).json({message: "ok", users});
       }

    } catch (error) {
        res.status(500).json({message: "error"});
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
        res.status(500).json({message: "error"});
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
        res.status(500).json({message: "error"});
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
        res.status(500).json({message: "error"});
    }
}
module.exports = {getAllUsers, getUserById, deleteUser, updateUser};