const jwt = require('jsonwebtoken');
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
        
        // Get the full user object from database to create JWT
        const fullUser = await getUserByUserName(req.body.userName);
        const { pass, ...safeUser } = fullUser;

        // Create JWT token for auto-login after registration
        const payload = {
            id: safeUser.id,
            userName: safeUser.useName || safeUser.userName,
            email: safeUser.email
        };

        const token = jwt.sign(
            payload,
            process.env.SECRET_KEY || 'dev_secret',
            { expiresIn: '30m' }
        );

        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 60 * 1000 // 30 minutes
            })
            .status(200)
            .json({ 
                message: "user added successfully", 
                token,
                user: safeUser 
            });
    } catch (error) {
        console.log("Error adding user:", error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

async function loginUser(req, res) {
    try {
        // בשלב הזה, ה‑middleware שם את המשתמש המאומת ב‑req.user
        const user = req.user;

        // לא מחזירים סיסמה ללקוח
        const { pass, ...safeUser } = user;

        const payload = {
            id: safeUser.id,
            userName: safeUser.useName || safeUser.userName,
            email: safeUser.email
        };

        const token = jwt.sign(
            payload,
            process.env.SECRET_KEY || 'dev_secret',
            { expiresIn: '30m' }
        );

        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 60 * 1000 // 30 minutes
            })
            .status(200)
            .json({
                message: "user logged in successfully",
                token,
                user: safeUser
            });
    } catch (error) {
        console.log("Error logging in user:", error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}
async function createJwt(req, res) {
    try {
        const user = req.user;
        const token = jwt.sign(
            {
                id: user.id,
                userName: user.useName,
                email: user.email
            },
            process.env.SECRET_KEY || 'dev_secret',
            { expiresIn: '3h' }
        );

        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3 * 60 * 60 * 1000
            })
            .status(200)
            .json({ message: "JWT created successfully", token });
    } catch (error) {
        console.log("Error creating JWT:", error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

function logoutUser(req, res) {
    try {
        // Clear the JWT cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        
        res.status(200).json({ message: "logged out successfully" });
    } catch (error) {
        console.log("Error logging out:", error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

module.exports = { addUser, loginUser, createJwt, logoutUser };