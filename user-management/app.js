const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../frontend/static')));

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// Ana sayfa: User login formu
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/user_login.html'));
});

const PORT = process.env.USER_PORT || 5005;
app.listen(PORT, () => {
    console.log(`User management service running on http://10.251.22.26:${PORT}`);
});
