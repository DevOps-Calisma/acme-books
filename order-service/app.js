const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Order = require('./src/models/Order');
const orderRoutes = require('./src/routes/orderRoutes');
const Eureka = require('eureka-js-client').Eureka;

const app = express();
const PORT = process.env.PORT || 5004;

const client = new Eureka({
  instance: {
    app: 'order-service',
    hostName: '10.251.22.28', // Replace with your service's hostname/IP if not running locally
    ipAddr: '10.251.22.28', // Replace with your service's IP
    port: {
      '$': PORT,
      '@enabled': 'true',
    },
    vipAddress: 'order-service',
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

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', orderRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Order Management Service running on ${PORT}`);
});