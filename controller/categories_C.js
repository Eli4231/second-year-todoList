const { getAllCategoriesFromDB, getCategoryByIdFromDB, deleteCategoryFromDB, addCategoryToDB } = require('../model/categories_M');

async function getAllCategories(req, res) {
    try {
        const user_id = req.user.id;
        const categories = await getAllCategoriesFromDB(user_id);
        if (categories.length === 0) {
            res.status(200).json({ message: "no categories found" });
        } else {
            res.status(200).json({ message: "ok", categories });
        }
    } catch (error) {
        console.log('ERROR in getAllCategories:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

async function getCategoryById(req, res) {
    try {
        const user_id = req.user.id;
        const categories = await getCategoryByIdFromDB(req.params.id, user_id);
        if (!categories || categories.length === 0) {
            res.status(404).json({ message: `category id ${req.params.id} not found` });
            return;
        }
        const category = categories[0];
        res.status(200).json({ message: "ok", category });
    } catch (error) {
        console.log('ERROR in getCategoryById:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

async function deleteCategory(req, res) {
    try {
        const user_id = req.user.id;
        const affectedRows = await deleteCategoryFromDB(req.params.id, user_id);
        if (!affectedRows || affectedRows === 0) {
            res.status(404).json({ message: `category id ${req.params.id} not found` });
            return;
        }
        res.status(200).json({ message: "category deleted successfully" });
    } catch (error) {
        console.log('ERROR in deleteCategory:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

async function addCategory(req, res) {
    try {
        const { name } = req.body;
        const user_id = req.user.id;
        const category = await addCategoryToDB({ name, user_id });
        res.status(200).json({ message: "category added successfully", category });
    } catch (error) {
        console.log('ERROR in addCategory:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

module.exports = { getAllCategories, getCategoryById, deleteCategory, addCategory };
