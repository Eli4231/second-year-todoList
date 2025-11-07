const express = require('express');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT ;
const api = process.env.HOST ;
const app = express();
app.use(express.static(__dirname + '/public'));
const db = require('./config/db_config');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port http://${api}:${port}`);
});