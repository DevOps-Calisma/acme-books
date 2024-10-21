// user-management/app.js
const express = require('express');
const path = require('path');
const app = express();

// Middleware'ler
app.use(express.json());  // JSON verilerini işlemek için
app.use(express.urlencoded({ extended: true }));  // Form verilerini işlemek için
app.use(express.static('static'));  // Statik dosyalar için

// Ana sayfa (kullanıcı formu)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'user_form.html'));
});

// API endpoint: Kullanıcı ekleme
app.post('/add-user', (req, res) => {
    const { username, email } = req.body;

    // Terminalde kullanıcı bilgilerini yazdır
    console.log(`New user added: ${username}, Email: ${email}`);

    // İstemciye yanıt gönder
    res.json({ status: "success", message: `User ${username} added!` });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`User management service running on http://localhost:${PORT}`);
});
