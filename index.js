const express = require('express');
require('dotenv').config();
const db = require('./config/db_config');

const host = process.env.HOST;
const port = process.env.PORT ;
const app = express();

app.use(express.static(__dirname + '/public'));

app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile((__dirname, 'public/index.html'));
});
app.use('/users', require('./routes/users_R'));

app.listen(port, () => {
    console.log(`Server is running on port http://${host}:${port}`);
});