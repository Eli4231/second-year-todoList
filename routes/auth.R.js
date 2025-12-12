const express = require('express');


const router = express.Router();
const{valuesToRegister, encryptPassword, login, verifyCredentials} = require('../middelware/auth_MID');
const { addUser, loginUser } = require('../controller/auth.C.js');

router.post('/register', valuesToRegister, encryptPassword, addUser);
router.post('/login', login, verifyCredentials, loginUser);



module.exports = router;