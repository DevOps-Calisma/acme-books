// src/controllers/orderController.js
const Order = require('../models/Order');
const axios = require('axios');

// Helper function to validate user
// Helper function to validate user
async function validateUser(userId) {

  try {
    console.log(userId + "ss3s");
    const userResponse = await axios.get(`http://10.251.22.28:5001/users/${userId}`); // Correct port

    if (userResponse.status === 200) { 
      return true; // Add return here
    } 
  } catch (error) {
    console.error('Error validating user:', error);
    return false;
  }
}

exports.createOrder = async (req, res) => {
  try {

    const { userId, order_id, item_id, quantity } = req.body;
    
    // 1. Validate the user
    const isUserValid = await validateUser(userId);
    if (!isUserValid) {

      return res.status(400).json({ message: 'User nottt foundd' });
    
    
    // 2. User exists, proceed with order creation
    const newOrder = new Order(order_id, userId, item_id, quantity);
    await Order.create(newOrder);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};



// GET /list-orders - Retrieve all orders
exports.listOrders = (req, res) => {
  try {
    const orders = Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
};