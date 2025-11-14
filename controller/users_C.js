const{getAllUsersFromDB, getUserByIdFromDB} = require('../model/users_M');



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
            res.status(404).json({message: "user not found"});
            return;
        }
        res.status(200).json({message: "ok", user: users[0]});
    } catch (error) {
        res.status(500).json({message: "error"});
    }
}

module.exports = {getAllUsers, getUserById};