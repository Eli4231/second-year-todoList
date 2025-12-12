function validateCategory(req, res, next) {
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: "name is required" });
    }
    
    // Optional: validate name length
    if (name.length > 255) {
        return res.status(400).json({ message: "name is too long (max 255 characters)" });
    }
    
    // Optional: validate description length if provided
    // if (description && description.length > 1000) {
    //     return res.status(400).json({ message: "description is too long (max 1000 characters)" });
    // }
    
    next();
}

module.exports = { validateCategory };

