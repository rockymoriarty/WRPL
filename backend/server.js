const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth"); // Pastikan path ini sesuai

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Ganti dengan password MySQL kamu
    database: "concertrev5"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Gunakan routes dari auth.js
app.use("/auth", authRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
