const express = require('express');
const path = require('path');
const app = express();

// Middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Router'ı ekle
const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/inventory', inventoryRoutes);

// Ana sayfa: Kitap ekleme formu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'inventory_form.html'));
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Inventory management service running on http://10.251.22.26:${PORT}`);
});

// Kitapları listeleme sayfası
app.get('/list-items', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'inventory_list.html'));
});
