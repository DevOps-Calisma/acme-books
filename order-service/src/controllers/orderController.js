// src/controllers/orderController.js
const Order = require('../models/Order');
const axios = require('axios');

// Helper function to validate user
async function validateUser(userId) {
    try {
        const userResponse = await axios.get(`http://10.251.22.28:5003/users/${userId}`); // Correct port
        if (userResponse.status === 200) {
            return true; // Add return here
        }
    } catch (error) {
        console.error('Error validating user:', error);
        return false;
    }
}

// Helper function to validate and update inventory
async function validateAndUpdateInventory(itemId, requestedStock) {
    try {
        // Fetch inventory item details
        const inventoryResponse = await axios.get(`http://10.251.22.28:5002/inventory/list-items`); // Assuming you have an endpoint to fetch all items
        const items = inventoryResponse.data;
        const item = items.find(i => i.id === parseInt(itemId)); // Assuming item IDs are integers

        if (!item) {
            return { valid: false, message: 'Item not found' };
        }

        if (item.stock < requestedStock) {
            return { valid: false, message: 'Insufficient stock' };
        }

        return { valid: true };

    } catch (error) {
        console.error('Error validating/updating inventory:', error);
        return { valid: false, message: 'Error validating/updating inventory' };
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { userId, order_id, item_id, stock } = req.body;

        // 1. Validate the user
        const isUserValid = await validateUser(userId);
        if (!isUserValid) {
            return res.status(400).json({ message: 'User not found' });
        }

        // 2. Validate and update inventory
        const inventoryValidation = await validateAndUpdateInventory(item_id, stock);
        if (!inventoryValidation.valid) {
            return res.status(400).json({ message: inventoryValidation.message });
        }

        // 4. Create the order (if everything is valid)
        const newOrder = new Order(order_id, userId, item_id, stock);
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