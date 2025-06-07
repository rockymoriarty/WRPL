require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const concertRoutes = require('./routes/concertRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//app.use(express.static(path.join(__dirname, '../public'))); // Serve static files dari folder public

// Log untuk debugging
console.log('JWT Secret Key:', process.env.JWT_SECRET || 'JWT_SECRET is undefined!');

// PENTING: Daftarkan route API dengan path yang benar
// Perubahan dari "/concerts" ke "/api/concerts" untuk mencocokkan dengan frontend
app.use('/auth', authRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/orders', orderRoutes);

// Endpoint tes untuk debugging
app.get('/api-test', (req, res) => {
  res.json({ message: 'API server berjalan dengan baik' });
});

// Tambahkan route fallback untuk SPA routing (opsional)
//app.get('*', (req, res) => {
  //res.sendFile(path.join(__dirname, '../public/index.html'));
//});

// Export the app for testing purposes
module.exports = app;

// Jalankan server only if this file is run directly (not required by a test)
if (require.main === module) {
  app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  });
}
