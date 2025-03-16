const express = require("express");
const router = express.Router();
const db = require("../database/db_config");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        // Hash password sebelum disimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert ke database
        const sql = "INSERT INTO customers (name, email, password) VALUES (?, ?, ?)";
        await db.query(sql, [fullname, email, hashedPassword]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
