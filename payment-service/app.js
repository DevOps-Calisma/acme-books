// payment-service/app.js
const express = require('express');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());
app.use('/payment', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});