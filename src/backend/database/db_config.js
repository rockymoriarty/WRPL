const mysql = require('mysql2'); 
require('dotenv').config();

let db;

if (process.env.DATABASE_URL) {
  // Koneksi pakai URL (cocok buat Railway)
  db = mysql.createConnection(process.env.DATABASE_URL);
} else {
  // Koneksi pakai konfigurasi terpisah (lokal/development)
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000
  };

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    console.error('❌ ERROR: DB environment variables are missing.');
    process.exit(1);
  }

  db = mysql.createConnection(dbConfig);
}

let connectAttempts = 0;
const maxConnectAttempts = 5;
const retryDelay = 3000;

function handleDisconnect() {
  console.log('Attempting to connect to database...');
  db.connect(err => {
    if (err) {
      console.error('Database connection failed:', err);
      connectAttempts++;
      if (connectAttempts < maxConnectAttempts) {
        console.log(`Retrying in ${retryDelay / 1000}s... (Attempt ${connectAttempts}/${maxConnectAttempts})`);
        setTimeout(handleDisconnect, retryDelay);
      } else {
        console.error('Max connection attempts reached.');
      }
      return;
    }
    console.log('✅ Connected to MySQL database');
    connectAttempts = 0;
  });

  db.on('error', err => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      console.log('🔄 Reconnecting...');
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = db;
