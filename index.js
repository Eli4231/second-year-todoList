const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./config/db_config');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.use('/users', require('./routes/users_R'));
app.use('/categories', require('./routes/categories_R'));
app.use('/auth', require('./routes/auth.R.js'));

app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});