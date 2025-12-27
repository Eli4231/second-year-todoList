const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser, updateUser, getCurrentUser } = require('../controller/users_C');
const { isValidId, valuesToUpdate } = require('../middelware/users_MID');
const { isLoggedIn } = require('../middelware/auth_MID');


router.get('/', isLoggedIn, getAllUsers);
router.get('/me', isLoggedIn, getCurrentUser);
router.get('/:id', isLoggedIn, isValidId, getUserById);
router.delete('/:id', isLoggedIn, isValidId, deleteUser);
router.patch('/:id', isLoggedIn, isValidId, valuesToUpdate, updateUser);



module.exports = router;