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

exports.createOrder = async (req, res) => {
  try {
    const { userId, order_id, item_id, quantity } = req.body;

    // 1. Validate the user
    const isUserValid = await validateUser(userId);
    if (!isUserValid) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 2. User exists, proceed with order creation
    const newOrder = new Order(order_id, userId, item_id, quantity);
    await Order.create(newOrder);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};


// Start the server
app.listen(PORT, () => {
  console.log(`Order Management Service running on http://localhost:${PORT}`);
});