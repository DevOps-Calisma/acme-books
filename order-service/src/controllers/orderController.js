require('dotenv').config();
const Order = require('../models/Order');
const axios = require('axios');
const Eureka = require('eureka-js-client').Eureka;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL;



const PORT = process.env.PORT || 5005; // Payment servisi için farklı bir port
const EUREKA_SERVER_URL = process.env.EUREKA_SERVER_URL;
const HOSTNAME = process.env.HOSTNAME || '10.251.22.28'; // Varsayılan olarak localhost


const client2 = new Eureka({
    instance: {
        app: 'payment-service', // Uygulama adı payment-service
        hostName: HOSTNAME,
        ipAddr: HOSTNAME,
        port: {
            '$': PORT,
            '@enabled': 'true',
        },
        vipAddress: 'payment-service', // vipAddress payment-service
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: new URL(EUREKA_SERVER_URL).hostname,
        port: parseInt(new URL(EUREKA_SERVER_URL).port),
        servicePath: '/eureka/apps/',
        registerWithEureka: true,
        fetchRegistry: true,
    },
});


client2.logger.level('debug'); // Add logging for Eureka client


client2.start(error => {
    if (error) {
        console.error('Eureka registration failed:', error);
    } else {
        console.log(`Eureka client registered at ${EUREKA_SERVER_URL}`);
    }
});

// Helper function to validate user
async function validateUser(userId) {
    try {
        const userResponse = await axios.get(`${USER_SERVICE_URL}/users/${userId}`); // String template literal
        if (userResponse.status === 200) {
            return true;
        }
    } catch (error) {
        console.error('Error validating user:', error);
        return false;
    }
}

// Helper function to validate and update inventory
async function validateAndUpdateInventory(item_id, requestedStock) {
    try {
        // Fetch inventory item details
        const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/inventory/list-items`); // String template literal
        const items = inventoryResponse.data;
        const item = items.find(i => i.id === parseInt(item_id));

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


        try {
            const paymentServiceInstances = client2.getInstancesByAppId('payment-service');
            if (!paymentServiceInstances || paymentServiceInstances.length === 0) {
                throw new Error("Payment service not found in Eureka.");
            }

            const paymentServiceInstance = paymentServiceInstances[0];

            const paymentServiceUrl = `http://10.251.22.28:5005/api/process-payment`; // Use ipAddr and port.$

            const paymentResponse = await axios.post(paymentServiceUrl, {
                order_id: order_id, // Consistent casing
            });

            if (paymentResponse.status !== 201) {
                throw new Error(`Payment failed with status ${paymentResponse.status}: ${paymentResponse.data}`); // Include more error details
            }

        } catch (error) {
            console.error('Error processing payment:', error);
            return res.status(500).json({ error: 'Payment service is not responding or payment failed.', details: error.message }); // More informative error message
        }

        const newOrder = new Order(order_id, userId, item_id, stock); // Consistent casing
        await Order.create(newOrder);

        res.status(201).json({ message: 'Payment successful.', order: newOrder });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};


// list-orders - Retrieve all orders
exports.listOrders = (req, res) => {
    try {
        const orders = Order.findAll(); // Order modelinizin findAll metodunu doğru implement ettiğinizden emin olun.
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
};