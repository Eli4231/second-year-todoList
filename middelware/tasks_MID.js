function validateTask(req, res, next) {
    const { text, is_done, category_id } = req.body;

    if (!text || String(text).trim() === '') {
        return res.status(400).json({ message: "text is required" });
    }
    if (is_done === undefined || is_done === null) {
        return res.status(400).json({ message: "is_done is required (0/1 or false/true)" });
    }
    if (category_id === undefined || category_id === null || String(category_id).trim() === '') {
        return res.status(400).json({ message: "category_id is required" });
    }

    next();
}

module.exports = validateTask;