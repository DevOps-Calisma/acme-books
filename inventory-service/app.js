const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const Eureka = require('eureka-js-client').Eureka;

function isAdmin(req, res, next) {
    const isAdminUser = req.headers['is-admin'] === 'true'; // Example: Check for a header 

    if (isAdminUser) {
        next(); // User is admin, proceed to the route
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

app.get('/list-items', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/inventory_list.html'));
});

const PORT = process.env.INVENTORY_PORT  || 5002;
app.listen(PORT, () => {
    console.log(`Inventory management service running. port: ${PORT}`);
});


const client = new Eureka({
  instance: {
    app: 'inventory-service',
    hostName: '10.251.22.28', // Replace with your service's hostname/IP if not running locally
    ipAddr: '10.251.22.28', // Replace with your service's IP
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
    host: 'eureka-server', // Replace with your Eureka server's host
    port: 8761, // Replace with your Eureka server's port
    registerWithEureka: true,
    fetchRegistry: true
  },
});

client.start();
module.exports = client;