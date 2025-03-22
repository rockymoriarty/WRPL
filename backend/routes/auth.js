const express = require("express");
const router = express.Router();
const db = require("../database/db_config");
const bcrypt = require("bcryptjs");

// REGISTER
router.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        // Hash password sebelum disimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert ke database dengan Promise untuk menangani async
        const sql = "INSERT INTO customers (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [fullname, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (err) {
        console.error("Hashing Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
    }

    try {
        // Cek apakah user ada di database
        const sql = "SELECT * FROM customers WHERE email = ?";
        db.query(sql, [email], async (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "User not found" });
            }

            const user = results[0];

            // Bandingkan password yang diinput dengan yang ada di database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Incorrect password" });
            }

            res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
