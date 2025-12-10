const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByUserName } = require('../model/auth_M');

function valuesToRegister(req, res, next){
    let {name,email,userName,pass} = req.body;
    if(!name || !email || !userName || !pass){
        return res.status(400).json({message: "all fields are required"});
    }
    next();
}

async function encryptPassword(req, res, next){
    try {
        let password = req.body.pass;
        let hashedPassword = await bcrypt.hash(password, 10);
        req.body.pass = hashedPassword;
        next();
    } catch (error) {
        console.log("Error encrypting password:", error.message);
        res.status(500).json({message: "error", details: error.message});
    }
}

function login(req, res, next){
    const { userName, pass } = req.body;
    if (!userName || !pass) {
        return res.status(400).json({ message: "userName and password are required" });
    }
    next();
}

async function verifyCredentials(req, res, next){
    try {
        const { userName, pass } = req.body;
        console.log('=== verifyCredentials Debug ===');
        console.log('userName received:', userName);
        console.log('pass received:', pass ? '***' : 'missing');
        console.log('req.body:', req.body);

        const user = await getUserByUserName(userName);
        console.log('User found:', user ? 'YES' : 'NO');
        if (!user) {
            console.log('ERROR: User not found in database');
            return res.status(401).json({ message: "invalid credentials" });
        }
        
        console.log('User from DB:', {
            id: user.id,
            useName: user.useName,
            email: user.email,
            hasPassword: !!user.pass,
            passwordLength: user.pass ? user.pass.length : 0,
            passwordStartsWith: user.pass ? user.pass.substring(0, 10) : 'none'
        });
        
        console.log('Comparing password...');
        console.log('Input password length:', pass ? pass.length : 0);
        console.log('Stored password hash starts with:', user.pass ? user.pass.substring(0, 20) : 'none');
        
        const isMatch = await bcrypt.compare(pass, user.pass);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            // Try to see if password is stored as plain text (for debugging)
            console.log('Stored password value (first 50 chars):', user.pass ? user.pass.substring(0, 50) : 'none');
        }
        
        if (!isMatch) {
            console.log('ERROR: Password does not match');
            return res.status(401).json({ message: "invalid credentials" });
        }

        console.log('SUCCESS: Credentials verified');
        req.user = user;
        next();
    } catch (error) {
        console.log('ERROR in verifyCredentials:', error.message);
        console.log('Error stack:', error.stack);
        res.status(500).json({message: "error", details: error.message});
    }
}

function isLoggedIn(req, res, next){
    // Debug: Log what we're receiving
    console.log('=== isLoggedIn Debug ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Cookies:', req.cookies);
    console.log('Has authorization header:', !!req.headers?.authorization);
    console.log('Has Authorization header:', !!req.headers?.Authorization);
    console.log('All headers keys:', Object.keys(req.headers || {}));
    
    // Try to get token from multiple sources
    let token = req.cookies?.jwt;
    console.log('Token from cookie:', token ? 'Found' : 'Not found');
    
    // Try Authorization header (check both lowercase and original case)
    if (!token) {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        console.log('Authorization header value:', authHeader ? authHeader.substring(0, 20) + '...' : 'None');
        if (authHeader) {
            token = authHeader.startsWith('Bearer ') 
                ? authHeader.replace(/^Bearer\s+/i, '').trim()
                : authHeader.trim();
            console.log('Token from Authorization header:', token ? 'Found' : 'Not found');
        }
    }
    
    // Try x-access-token header (alternative, check both cases)
    if (!token) {
        token = req.headers?.['x-access-token'] || req.headers?.['X-Access-Token'];
        if (token) {
            token = token.trim();
            console.log('Token from x-access-token header: Found');
        }
    }
    
    if(!token){
        console.log('ERROR: No token found in any location');
        return res.status(401).json({
            message: "unauthorized", 
            details: "No token provided",
            hint: "Send token in Authorization header as 'Bearer <token>' or as cookie 'jwt'",
            debug: {
                hasCookies: !!req.cookies,
                hasAuthHeader: !!(req.headers?.authorization || req.headers?.Authorization),
                headerKeys: Object.keys(req.headers || {})
            }
        });
    }
    
    console.log('Token found, length:', token.length);
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'dev_secret');
        console.log('Token verified successfully');
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log('ERROR verifying token:', error.message);
        return res.status(401).json({
            message: "unauthorized", 
            details: error.message
        });
    }
}

module.exports = {valuesToRegister, encryptPassword, login, verifyCredentials, isLoggedIn};