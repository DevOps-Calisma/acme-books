const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../frontend/static')));

const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/inventory', inventoryRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/inventory_form.html'));
});

app.get('/list-items', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/inventory_list.html'));
});

const PORT = process.env.INVENTORY_PORT  || 5002;
app.listen(PORT, () => {
    console.log(`Inventory management service running. port: ${PORT}`);
});
