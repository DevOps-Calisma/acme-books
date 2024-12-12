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

function isAdmin(req, res, next) {
    const isAdminUser = req.headers['is-admin'] === 'true';

    if (isAdminUser) {
        next();
    } else {
        res.status(403).json({ message: "Unauthorized: Admin access required." });
    }
}

router.post('/add-item', isAdmin, (req, res) => {
    const { item_name, author, price, image_url, stock } = req.body;

    const checkQuery = `
        SELECT * FROM inventory 
        WHERE LOWER(item_name) = LOWER($1) 
          AND LOWER(author) = LOWER($2) 
          AND price = $3
    `;
    const checkValues = [item_name, author, price];

    pool.query(checkQuery, checkValues, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error checking item" });
        }

        if (result.rows.length > 0) {
            const updateQuery = `
                UPDATE inventory 
                SET stock = stock + $1 
                WHERE LOWER(item_name) = LOWER($2) 
                  AND LOWER(author) = LOWER($3) 
                  AND price = $4
            `;
            const updateValues = [stock, item_name, author, price];

            pool.query(updateQuery, updateValues, (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating stock" });
                }
                res.json({ message: `Stock for item ${item_name} updated successfully!` });
            });
        } else {
            const insertQuery = `
                INSERT INTO inventory(item_name, author, price, image_url, stock) 
                VALUES($1, $2, $3, $4, $5)
            `;
            const insertValues = [item_name, author, price, image_url, stock];

            pool.query(insertQuery, insertValues, (err, insertResult) => {
                if (err) {
                    return res.status(500).json({ message: "Error adding item" });
                }
                res.json({ message: `Item ${item_name} added successfully!` });
            });
        }
    });
});

router.get('/list-items', (req, res) => {
    const query = 'SELECT * FROM inventory';
    pool.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error fetching items" });
        } else {
            res.json(result.rows);
        }
    });
});

router.delete('/delete-item/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM inventory WHERE id = $1';

    pool.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ status: "error", message: "Error deleting item" });
        } else {
            res.json({ status: "success", message: `Item with ID ${id} deleted successfully!` });
        }
    });
});

router.put('/update-stock/:id', isAdmin, (req, res) => {
    const itemId = req.params.id;
    const { stockChange } = req.body;

    if (typeof stockChange !== 'number') {
        return res.status(400).json({ message: "Invalid stock change value" });
    }

    const query = `
        UPDATE inventory
        SET stock = stock + $1
        WHERE id = $2
        RETURNING *
    `;

    pool.query(query, [stockChange, itemId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error updating stock" });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: `Stock for item ID ${itemId} updated successfully!`, updatedItem: result.rows[0] });
    });
});

module.exports = router;
