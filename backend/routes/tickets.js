const express = require("express");
const router = express.Router();
const db = require("../database/db_config");

// Endpoint untuk mendapatkan tiket user berdasarkan user_id
router.get("/my-tickets/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT 
            concerts.concert_name, 
            concerts.location, 
            concerts.concert_date, 
            tickets.status, 
            orders.quantity
        FROM orders
        JOIN tickets ON orders.ticket_id = tickets.ticket_id
        JOIN concerts ON tickets.concert_id = concerts.concert_id
        WHERE orders.user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user tickets:", err);
            return res.status(500).json({ message: "Error retrieving tickets" });
        }
        res.json(results);
    });
});

module.exports = router;
