const express = require('express');
const router = express.Router();
const{getAllUsers, getUserById} = require('../controller/users_C');
const{isValidId} = require('../middelware/users_MID');

router.get('/',getAllUsers);
router.get('/:id',isValidId,getUserById);



    
module.exports = router;