// paymentService.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Eureka = require('eureka-js-client').Eureka;


const app = express();
const PORT = process.env.PORT || 3002; // Payment servisi için farklı bir port
const EUREKA_SERVER_URL = process.env.EUREKA_SERVER_URL;
const HOSTNAME = process.env.HOSTNAME || 'localhost'; // Varsayılan olarak localhost


const client = new Eureka({
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

client.start();


// Middleware
app.use(bodyParser.json());

// Payment endpoint (Order servisinden istek alacak endpoint)
app.post('/api/process-payment', (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // Ödeme işlemleri burada simüle edilebilir.
        // Örneğin, bir ödeme gateway'i ile iletişim kurulabilir.
        console.log(`Processing payment for order ${orderId} with amount ${amount}`);

        // Başarılı ödeme simülasyonu (201 Created döndürülüyor)
        res.status(201).json({ message: 'Payment processed successfully', transactionId: 'simulated-transaction-id' });

    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Failed to process payment', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Payment Service running on ${PORT}`);
});