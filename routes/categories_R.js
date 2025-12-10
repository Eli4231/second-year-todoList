const express = require('express');
const router = express.Router();
const categoriesC = require('../controller/categories_C');

router.get('/', categoriesC.getAllCategories);
router.get('/:id', categoriesC.getCategoryById);
router.delete('/:id', categoriesC.deleteCategory);

module.exports = router;
