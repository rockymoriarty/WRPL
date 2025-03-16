const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Kosongkan jika pakai XAMPP
    database: "concertrev5"
});

// Koneksi ke database
db.connect(err => {
    if (err) {
        console.error("Gagal koneksi ke database: " + err.message);
    } else {
        console.log("Terhubung ke database!");
    }
});

module.exports = db; // Export koneksi agar bisa dipakai di file lain
