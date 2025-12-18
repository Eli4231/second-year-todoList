const express = require('express');
const router = express.Router();
const categoriesC = require('../controller/categories_C');
const { validateCategory } = require('../middelware/categories_MID');
const { isLoggedIn } = require('../middelware/auth_MID');

router.get('/', isLoggedIn, categoriesC.getAllCategories);
router.get('/:id', isLoggedIn, categoriesC.getCategoryById);
router.post('/', isLoggedIn, validateCategory, categoriesC.addCategory);
router.delete('/:id', isLoggedIn, categoriesC.deleteCategory);
router.patch('/:id', isLoggedIn, validateCategory, categoriesC.updateCategory);
module.exports = router;
