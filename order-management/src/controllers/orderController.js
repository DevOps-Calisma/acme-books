// src/controllers/orderController.js
const Order = require('../models/Order');
const axios = require('axios');

// Helper function to validate user
async function validateUser(userId) {
  try {
    const userResponse = await axios.get(`http://192.168.1.107:5001/users/${userId}`);
    return userResponse.status === 200;
  } catch (error) {
    console.error('Error validating user:', error);
    return false;
  }
}

// Helper function to validate payment
async function validatePayment(orderId, amount) {
  try {
    const paymentResponse = await axios.post('http://localhost:5003/payment/process-payment', {
      orderId,
      amount
    });
    return paymentResponse.status === 201;
  } catch (error) {
    console.error('Error processing payment:', error);
    return false;
  }
}

// Create Order function
exports.createOrder = async (req, res) => {
  const { userId, order_id, item_id, quantity, amount } = req.body;

  // 1. Kullanıcı doğrulaması
  const isUserValid = await validateUser(userId);
  if (!isUserValid) {
    return res.status(400).json({ message: 'User not found' });
  }

  // 2. Ödeme doğrulaması
  const isPaymentSuccessful = await validatePayment(order_id, amount);
  if (!isPaymentSuccessful) {
    return res.status(400).json({ message: 'Payment failed' });
  }

  // 3. Sipariş oluşturma
  const newOrder = new Order(order_id, userId, item_id, quantity);
  Order.create(newOrder);
  res.status(201).json({ message: 'Order created successfully', order: newOrder });
};

exports.listOrders = (req, res) => {
  const orders = Order.findAll();
  res.status(200).json(orders);
  
};
