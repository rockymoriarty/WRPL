const jwt = require('jsonwebtoken');

// Middleware untuk memverifikasi token JWT
function verifyToken(req, res, next) {
  // Dapatkan token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  
  try {
    // Verifikasi token menggunakan secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tambahkan informasi user ke objek request
    req.user = {
        id: decoded.user_id, // disesuaikan dengan yang dikirim waktu sign
        email: decoded.email
    };
      
    
    next(); // Lanjutkan ke handler berikutnya
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
}

module.exports = verifyToken;