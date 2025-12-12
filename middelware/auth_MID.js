const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByUserName } = require('../model/auth_M');

function valuesToRegister(req, res, next) {
    let { name, email, userName, pass } = req.body;
    if (!name || !email || !userName || !pass) {
        return res.status(400).json({ message: "all fields are required" });
    }
    next();
}

async function encryptPassword(req, res, next) {
    try {
        let password = req.body.pass;
        let hashedPassword = await bcrypt.hash(password, 10);
        req.body.pass = hashedPassword;
        next();
    } catch (error) {
        console.log("Error encrypting password:", error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

function login(req, res, next) {
    const { userName, pass } = req.body;
    if (!userName || !pass) {
        return res.status(400).json({ message: "userName and password are required" });
    }
    next();
}

async function verifyCredentials(req, res, next) {
    try {
        const { userName, pass } = req.body;
        const user = await getUserByUserName(userName);
        if (!user) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        const isMatch = await bcrypt.compare(pass, user.pass);

        if (!isMatch) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('ERROR in verifyCredentials:', error.message);
        res.status(500).json({ message: "error", details: error.message });
    }
}

function isLoggedIn(req, res, next) {
    let token = req.cookies?.jwt;

    if (!token) {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        if (authHeader) {
            token = authHeader.startsWith('Bearer ')
                ? authHeader.replace(/^Bearer\s+/i, '').trim()
                : authHeader.trim();
        }
    }

    if (!token) {
        token = req.headers?.['x-access-token'] || req.headers?.['X-Access-Token'];
        if (token) {
            token = token.trim();
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "unauthorized",
            details: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'dev_secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "unauthorized",
            details: error.message
        });
    }
}

module.exports = { valuesToRegister, encryptPassword, login, verifyCredentials, isLoggedIn };