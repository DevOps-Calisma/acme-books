const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const Eureka = require('eureka-js-client').Eureka;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../frontend/static')));

// isAdmin Middleware
function isAdmin(req, res, next) {
    const isAdminUser = req.headers['is-admin'] === 'true';

    if (isAdminUser) {
        next();
    } else {
        res.status(403).json({ message: "Unauthorized: Admin access required." });
    }
}

// Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/inventory', inventoryRoutes);

// Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/inventory_form.html'));
});

app.get('/list-items', (req, res) => {
    const logMessage = "BURAYA GELDIM LIOSTELEYECEM INS APP:JSSSS\n";
    const logFilePath = path.join(__dirname, 'inventory-log.txt');
    fs.appendFileSync(logFilePath, logMessage);
    res.sendFile(path.join(__dirname, '../frontend/pages/inventory_list.html'));
});

// Eureka Client Setup
const PORT = process.env.INVENTORY_PORT || 5002;
const EUREKA_SERVER_URL = process.env.EUREKA_SERVER_URL;
const HOSTNAME = process.env.HOSTNAME;

const client = new Eureka({
    instance: {
        app: 'inventory-service',
        hostName: HOSTNAME,
        ipAddr: HOSTNAME,
        port: {
            '$': PORT,
            '@enabled': 'true',
        },
        vipAddress: 'inventory-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: new URL(EUREKA_SERVER_URL).hostname, // Host 'eureka-server'
        port: parseInt(new URL(EUREKA_SERVER_URL).port), // Port '8761'
        servicePath: '/eureka/apps',
        registerWithEureka: true,
        fetchRegistry: true,
    },
});

client.start();
module.exports = client;

// Start the server
app.listen(PORT, () => {
    console.log(`Inventory management service running. port: ${PORT}`);
});
