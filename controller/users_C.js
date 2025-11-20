const{getAllUsersFromDB, getUserByIdFromDB, deleteUserFromDB} = require('../model/users_M');



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
        const users = await deleteUserFromDB(req.params.id);
        res.status(200).json({message: "user deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "error"});
    }
}
module.exports = {getAllUsers, getUserById, deleteUser};