const express = require('express');
const router = express.Router();
const{getAllUsers, getUserById, deleteUser, updateUser} = require('../controller/users_C');
const{isValidId, valuesToUpdate} = require('../middelware/users_MID');


router.get('/',getAllUsers);
router.get('/:id',isValidId,getUserById);
router.delete('/:id',isValidId,deleteUser);
router.patch('/:id',isValidId,valuesToUpdate,updateUser);



    
module.exports = router;