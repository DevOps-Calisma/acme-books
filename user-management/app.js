const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../frontend/static')));

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/user_login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/user_signup.html'));
});

const PORT = process.env.USER_PORT || 5003;
app.listen(PORT, () => {
    console.log(`User management service running on port: ${PORT}`);
});
