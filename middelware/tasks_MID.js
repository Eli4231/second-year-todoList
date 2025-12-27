function validateTask(req, res, next) {
    const { description, isDone, category_id } = req.body;

    if (!description || String(description).trim() === '') {
        return res.status(400).json({ message: "description is required" });
    }
    if (isDone === undefined || isDone === null) {
        return res.status(400).json({ message: "isDone is required (0/1 or false/true)" });
    }
    if (category_id === undefined || category_id === null || String(category_id).trim() === '') {
        return res.status(400).json({ message: "category_id is required" });
    }

    next();
}

module.exports = validateTask;