require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Order = require('./src/models/Order');
const orderRoutes = require('./src/routes/orderRoutes');
const Eureka = require('eureka-js-client').Eureka;

const app = express();
const PORT = process.env.PORT; 
const EUREKA_SERVER_URL = process.env.EUREKA_SERVER_URL; 
const HOSTNAME = process.env.HOSTNAME; 

const client = new Eureka({
  instance: {
    app: 'order-service',
    hostName: HOSTNAME, 
    ipAddr: HOSTNAME, 
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
    host: new URL(EUREKA_SERVER_URL).hostname, 
    port: parseInt(new URL(EUREKA_SERVER_URL).port), 
    registerWithEureka: true,
    fetchRegistry: true,
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
