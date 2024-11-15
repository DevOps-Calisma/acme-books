// payment-service/routes/paymentRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Ödeme işlemi
router.post('/process-payment', async (req, res) => {
    const { orderId, amount } = req.body;

    // Ödemeyi başarılı kabul ediyoruz (gerçek bir ödeme sistemi simülasyonu)
    const isPaymentSuccessful = true;

    if (isPaymentSuccessful) {
        try {
            // Order Servisi'ne ödeme onayı gönder
            const response = await axios.post('http://localhost:5004/api/order-confirmation', {
                orderId,
                status: 'PAID'
            });

            // Başarılı olursa `201 Created` yanıtı döner
            res.status(201).json({ message: 'Payment processed and order confirmed', orderId });
        } catch (error) {
            console.error('Order Service ile iletişim kurulamadı:', error);
            res.status(500).json({ message: 'Payment processed, but failed to confirm order' });
        }
    } else {
        res.status(400).json({ message: 'Payment failed' });
    }
});

module.exports = router;
