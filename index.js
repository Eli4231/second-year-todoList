const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./config/db_config');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/public'));

app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.use('/users', require('./routes/users_R'));

app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});