const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Order = require('./src/models/Order');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', orderRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Order Management Service running on ${PORT}`);
});