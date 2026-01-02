const express = require('express');


const router = express.Router();
const{valuesToRegister, encryptPassword, login, verifyCredentials} = require('../middelware/auth_MID');
const { addUser, loginUser, logoutUser } = require('../controller/auth.C.js');

router.post('/register', valuesToRegister, encryptPassword, addUser);
router.post('/login', login, verifyCredentials, loginUser);
router.post('/logout', logoutUser);



module.exports = router;