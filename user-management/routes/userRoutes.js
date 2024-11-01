const express = require('express');
const router = express.Router();
const { Pool } = require('pg');  // PostgreSQL modülü
require('dotenv').config();  // .env dosyasını yükle

// PostgreSQL veritabanı bağlantısı
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Kullanıcı kaydetme
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    const query = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3)';
    const values = [username, email, password];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Error registering user', err);
            res.status(500).json({ status: "error", message: "Error registering user" });
        } else {
            res.json({ status: "success", message: `User ${username} registered successfully!` });
        }
    });
});

// Kullanıcı giriş işlemi
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const values = [email, password];

    pool.query(query, values, (err, result) => {
        if (err || result.rows.length === 0) {
            console.error('Invalid login credentials');
            res.status(401).json({ status: "error", message: "Invalid email or password" });
        } else {
            res.json({ status: "success", message: `Welcome back, ${result.rows[0].username}!` });
        }
    });
});

module.exports = router;
