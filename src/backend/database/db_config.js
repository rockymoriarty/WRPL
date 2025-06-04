const mysql = require('mysql');
require('dotenv').config(); // Ensure environment variables are loaded

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'concertrev5',
  connectTimeout: 10000 // Optional: Increase connection timeout
};

const db = mysql.createConnection(dbConfig);

let connectAttempts = 0;
const maxConnectAttempts = 5;
const retryDelay = 3000; // 3 seconds

function handleDisconnect() {
  console.log('Attempting to connect to database...');
  db.connect(err => {
    if (err) {
      console.error('Database connection failed:', err);
      connectAttempts++;
      if (connectAttempts < maxConnectAttempts) {
        console.log(
          `Retrying connection in ${retryDelay / 1000} seconds... (Attempt ${connectAttempts}/${maxConnectAttempts})`
        );
        setTimeout(handleDisconnect, retryDelay);
      } else {
        console.error('Max connection attempts reached. Could not connect to the database.');
      }
      return;
    }
    console.log('Connected to MySQL database');
    connectAttempts = 0; // Reset on successful connection
  });

  db.on('error', function (err) {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      console.log('Reconnecting due to lost connection or reset...');
      // For persistent connections, you might re-initialize the connection object here
      // or use a connection pool which handles this better.
      // For this script, we'll just log and expect manual restart if needed after initial connect.
    } else {
      throw err;
    }
  });
}

handleDisconnect(); // Initial connection attempt

module.exports = db; // Export koneksi agar bisa dipakai di file lain
