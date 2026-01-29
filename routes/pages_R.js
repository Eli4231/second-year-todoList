const express = require('express');
const router = express.Router();
const path = require('path');
const { isLoggedInPage } = require('../middelware/auth_MID');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","login.html"));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","register.html"));
});

router.get('/home', isLoggedInPage, (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","home.html"));
});

router.get('/manage-users', isLoggedInPage, (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","manage-users.html"));
});

router.get('/manage-categories', isLoggedInPage, (req, res) => {
    res.sendFile(path.join(__dirname,"..","public","pages","manage-categories.html"));
});

module.exports = router;