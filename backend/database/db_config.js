const mysql = require("mysql");
require('dotenv').config(); // Tambahkan ini jika kamu menggunakan dotenv untuk membaca .env lokal

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost", // Baca dari process.env.DB_HOST, fallback ke localhost
    user: process.env.DB_USER || "root",     // Baca dari process.env.DB_USER, fallback ke root
    password: process.env.DB_PASSWORD || "", // Baca dari process.env.DB_PASSWORD, fallback ke kosong
    database: process.env.DB_DATABASE || "concertrev5" // Baca dari process.env.DB_DATABASE, fallback ke concertrev5
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

module.exports = db;