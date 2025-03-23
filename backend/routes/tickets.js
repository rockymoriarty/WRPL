const express = require("express");
const router = express.Router();
const db = require("../database/db_config"); // Pastikan ini benar

// Endpoint untuk mendapatkan tiket yang telah dibeli oleh pengguna
router.get("/mytickets/:user_id", (req, res) => {
    const userId = req.params.user_id;
    
    const query = `
        SELECT o.order_id, o.user_id, o.quantity, o.order_date, 
               t.ticket_id, t.category, t.price, t.status 
        FROM orders o
        JOIN tickets t ON o.ticket_id = t.ticket_id
        WHERE o.user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(results);
    });
});

module.exports = router;
