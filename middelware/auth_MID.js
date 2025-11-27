const bcrypt = require('bcrypt');
const { getUserByEmail, getUserById } = require('../model/auth_M');

function valuesToRegister(req, res, next){
    let {name,email,userName,pass} = req.body;
    if(!name || !email || !userName || !pass){
        return res.status(400).json({message: "all fields are required"});
    }
    next();
}

async function encryptPassword(req, res, next){
    try {
        let password = req.body.pass;
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        req.body.pass = hashedPassword;
        next();
    } catch (error) {
        res.status(500).json({message: "error"});
    }
}

function login(req, res, next){
    let {email, pass, id} = req.body;
    if(!pass || (!email && !id)){
        return res.status(400).json({message: "email or id and password are required"});
    }
    next();
}

async function verifyCredentials(req, res, next){
    try {
        const { email, id } = req.body;
        const user = email
            ? await getUserByEmail(email)
            : await getUserById(parseInt(id, 10));
        if(!user){
            return res.status(401).json({message: "invalid credentials"});
        }
        const isMatch = await bcrypt.compare(req.body.pass, user.pass);
        if(!isMatch){
            return res.status(401).json({message: "invalid credentials"});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({message: "error"});
    }
}

module.exports = {valuesToRegister, encryptPassword, login, verifyCredentials};