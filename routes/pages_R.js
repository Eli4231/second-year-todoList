const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","login.html"));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","register.html"));
});

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","home.html"));
});
module.exports = router;