const{getAllUsersFromDB} = require('../model/users_M');



async function getAllUsers(req, res){
    try {
        console.log("hi");
        rows = await getAllUsersFromDB();
        res.status(200).json({message: "ok"});
    } catch (error) {
        res.status(500).json({message: "error"});
    }
   
   
}
module.exports = {getAllUsers};