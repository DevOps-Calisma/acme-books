const express = require('express');
const router = express.Router();
const { Pool } = require('pg');  // PostgreSQL modülü
require('dotenv').config();  // .env dosyasını yükle

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Envanter öğesi ekleme
router.post('/add-item', (req, res) => {
    const { item_name, author, price, image_url } = req.body;
    
    const query = 'INSERT INTO inventory(item_name, author, price, image_url) VALUES($1, $2, $3, $4)';
    const values = [item_name, author, price, image_url];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data', err);
            res.status(500).json({ status: "error", message: "Error adding item" });
        } else {
            res.json({ status: "success", message: `Item ${item_name} added successfully!` });
        }
    });
});

// Kitapları listeleme
router.get('/list-items', (req, res) => {
    const query = 'SELECT * FROM inventory';

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching data', err);
            res.status(500).json({ status: "error", message: "Error fetching items" });
        } else {
            res.json(result.rows);
        }
    });
});

// Kitapları silme
router.delete('/delete-item/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM inventory WHERE id = $1';

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item', err);
            res.status(500).json({ status: "error", message: "Error deleting item" });
        } else {
            res.json({ status: "success", message: `Item with ID ${id} deleted successfully!` });
        }
    });
});


module.exports = router;
