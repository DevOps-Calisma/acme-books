const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const Eureka = require('eureka-js-client').Eureka;

function isAdmin(req, res, next) {
    const isAdminUser = req.headers['is-admin'] === 'true';

    if (isAdminUser) {
        next();
    } else {
        res.status(403).json({ message: "Unauthorized: Admin access required." });
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../frontend/static')));

const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/inventory', inventoryRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/inventory_form.html'));
});

const fs = require('fs');
const logFilePath = path.join(__dirname, 'inventory-log.txt');

app.get('/list-items', (req, res) => {
    const logMessage = "BURAYA GELDIM LIOSTELEYECEM INS APP:JSSSS\n";
    fs.appendFileSync(logFilePath, logMessage);
    res.sendFile(path.join(__dirname, '../frontend/pages/inventory_list.html'));
});

const PORT = process.env.INVENTORY_PORT || 5002;
app.listen(PORT, () => {
    console.log(`Inventory management service running. port: ${PORT}`);
});

const client = new Eureka({
  instance: {
    app: 'inventory-service',
    hostName: process.env.HOSTNAME,
    ipAddr: process.env.HOSTNAME,
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
    host: process.env.EUREKA_SERVER_HOST,
    port: parseInt(process.env.EUREKA_SERVER_PORT),
    registerWithEureka: true,
    fetchRegistry: true,
  },
});

client.start();
module.exports = client;
