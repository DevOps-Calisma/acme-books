const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();
const Eureka = require('eureka-js-client').Eureka;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, '../frontend/static')));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

app.post('/add-user', async (req, res) => {
    const { first_name, email } = req.body;

    if (!first_name || !email) {
        return res.status(400).json({ error: 'Username and email are required.' });
    }

    try {
        console.log("1");
        const query = 'INSERT INTO users (first_name, email) VALUES ($1, $2) RETURNING id';
        console.log("2");
        const values = [first_name, email];
        console.log("3");
        const result = await pool.query(query, values);
        console.log("4");

        const userId = result.rows[0].id;
        res.json({ message: 'User added successfully!', userId });
    } catch (error) {
        console.error("Error adding user", error);
        res.status(500).json({ error: 'Internal server error (probably dbbb connection error)' });
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

const client = new Eureka({
    instance: {
      app: 'user-service',
      hostName: process.env.HOSTNAME,
      ipAddr: process.env.HOSTNAME,
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
      host: process.env.EUREKA_SERVER_HOST,
      port: parseInt(process.env.EUREKA_SERVER_PORT),
      servicePath: '/eureka/apps',
      registerWithEureka: true,
      fetchRegistry: false
    },
  });

client.start();
module.exports = client;
