// order-management/src/routes/orderRoutes.js
const express = require('express');
const { createOrder, listOrders } = require('../controllers/orderController');
const router = express.Router();

// Sipariş oluşturma endpoint'i
router.post('/create-order', createOrder);

// Tüm siparişleri listeleme endpoint'i
router.get('/list-orders', listOrders);

// Order Confirmation Endpoint
router.post('/order-confirmation', (req, res) => {
    const { orderId, status } = req.body;

    if (status === 'PAID') {
        console.log(`Order ${orderId} has been confirmed as PAID.`);
        res.status(201).json({ message: `Order ${orderId} confirmed as PAID.` });
    } else {
        res.status(400).json({ message: 'Invalid payment status' });
    }
});

module.exports = router;
