const express = require('express');
const { createOrder, listOrders } = require('../controllers/orderController');
const router = express.Router();

router.post('/create-order', createOrder);
router.get('/list-orders', listOrders);

module.exports = router;