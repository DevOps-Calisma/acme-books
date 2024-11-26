const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Error logging in' });
        if (result.rows.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    });
});

router.post('/signup', (req, res) => {
    const { first_name, last_name, city, phone_number, email, password } = req.body;
    const query = 'INSERT INTO users (first_name, last_name, city, phone_number, email, password) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [first_name, last_name, city, phone_number, email, password];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            return res.status(500).json({ success: false, message: 'Error signing up' });
        }
        res.json({ success: true });
    });
});

module.exports = router;
