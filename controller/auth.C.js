const { addUserToDB } = require('../model/auth_M');

async function addUser(req, res){
    try {
        const user = await addUserToDB(req.body);
        res.status(200).json({message: "user added successfully", user});
    } catch (error) {
        console.log("Error adding user:", error.message);
        res.status(500).json({message: "error", details: error.message});
    }
}
async function loginUser(req, res){
    try {
        res.status(200).json({message: "user logged in successfully", user: req.user});
    } catch (error) {
        res.status(500).json({message: "error"});
    }
}
module.exports = {addUser, loginUser};