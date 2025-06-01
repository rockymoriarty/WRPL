const mysql = require("mysql");

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "concertrev5"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

module.exports = db; // Export koneksi agar bisa dipakai di file lain
