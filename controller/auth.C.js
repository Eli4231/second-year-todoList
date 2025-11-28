const { addUserToDB, getUserByEmail, getUserByUserName } = require('../model/auth_M');

async function addUser(req, res) {
    try {
        const existingByEmail = await getUserByEmail(req.body.email);
        if (existingByEmail) {
            return res.status(400).json({ message: "email already exists" });
        }

        const existingByUserName = await getUserByUserName(req.body.userName);
        if (existingByUserName) {
            return res.status(400).json({ message: "userName already exists" });
        }
        const user = await addUserToDB(req.body);
        res.status(200).json({ message: "user added successfully", user });
    } catch (error) {
        console.log("Error adding user:", error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

async function loginUser(req, res) {
    try {
        // בשלב הזה, ה‑middleware שם את המשתמש המאומת ב‑req.user
        res.status(200).json({ message: "user logged in successfully", user: req.user });
    } catch (error) {
        console.log("Error logging in user:", error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

module.exports = { addUser, loginUser };