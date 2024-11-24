const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();
const Eureka = require('eureka-js-client').Eureka;

const app = express();

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend
app.use('/static', express.static(path.join(__dirname, '../frontend/static')));


// PostgreSQL Connection Pool Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// User Routes (using PostgreSQL)
app.post('/add-user', async (req, res) => {
    const { first_name, email } = req.body;

    // Basic validation
    if (!first_name || !email) {
        return res.status(400).json({ error: 'Username and email are required.' });
    }

    try {
        const query = 'INSERT INTO users (first_name, email) VALUES ($1, $2) RETURNING id';
        const values = [first_name, email];
        const result = await pool.query(query, values);

        const userId = result.rows[0].id; // Get the generated user ID
        res.json({ message: 'User added successfully!', userId });
    } catch (error) {
        console.error("Error adding user", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [userId];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error retrieving user", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const result = await pool.query(query);

        res.json(result.rows);
    } catch (error) {
        console.error("Error retrieving users", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Frontend Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/user_login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/user_signup.html'));
});

// Start the server
const PORT = process.env.USER_PORT || 5003;
app.listen(PORT, () => {
    console.log(`User management service running on port: ${PORT}`);
});




const client = new Eureka({
    instance: {
      app: 'user-service',
      hostName: '10.251.22.28', // Replace with your service's hostname/IP if not running locally
      ipAddr: '10.251.22.28', // Replace with your service's IP
      port: {
        '$': PORT,
        '@enabled': 'true',
      },
      vipAddress: 'user-service',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      host: '10.251.22.28', // Replace with your Eureka server's host
      port: 8761, // Replace with your Eureka server's port
      registerWithEureka: true,
      fetchRegistry: false
    },
  });
  
  client.start();
  module.exports = client;