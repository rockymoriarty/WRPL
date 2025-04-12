const express = require("express");
const router = express.Router();
const db = require("../database/db_config");
const verifyToken = require("../middleware/verifyToken"); // Middleware untuk verifikasi token

// Endpoint untuk membuat order baru
router.post("/", verifyToken, (req, res) => {
  const { ticket_id, quantity } = req.body;
  const user_id = req.user.id; // Didapat dari middleware verifyToken
  const order_date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  
  // Validasi input
  if (!ticket_id || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid order data. Ticket ID and quantity are required." });
  }
  
  // Query untuk menyimpan order
  const query = "INSERT INTO orders (user_id, ticket_id, quantity, order_date, status) VALUES (?, ?, ?, ?, 'Active')";
  
  db.query(query, [user_id, ticket_id, quantity, order_date], (error, results) => {
    if (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
    
    return res.status(201).json({ 
      message: "Order created successfully", 
      order_id: results.insertId,
      order_date: order_date
    });
  });
  console.log("Ticket ID:", ticket_id, "Quantity:", quantity, "User ID:", user_id);

});

router.get('/concert/:concert_id', (req, res) => {
  const concertId = req.params.concert_id;
  const query = 'SELECT * FROM tickets WHERE concert_id = ?';

  db.query(query, [concertId], (err, results) => {
      if (err) {
          console.error('Error fetching tickets by concert ID:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      res.json(results);
  });
});

// Endpoint untuk cancel tiket
router.post("/cancel/:order_id", verifyToken, (req, res) => {
  const user_id = req.user.id;
  const order_id = req.params.order_id;

  console.log("User", user_id, "is cancelling order", order_id);

  const query = `
    UPDATE orders 
    SET status = 'Canceled' 
    WHERE order_id = ? AND user_id = ?
  `;

  db.query(query, [order_id, user_id], (error, result) => {
    if (error) {
      console.error("Error canceling ticket:", error);
      return res.status(500).json({ error: "Failed to cancel ticket" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Unauthorized or order not found" });
    }

    return res.json({ message: "Ticket canceled successfully" });
  });
});

// Endpoint untuk mendapatkan order berdasarkan user_id

// Endpoint untuk mendapatkan order berdasarkan user_id
router.get("/user", verifyToken, (req, res) => {
  const user_id = req.user.id;

  const query = `
    SELECT 
      o.order_id, o.quantity, o.order_date, o.status,
      c.concert_name, c.location, c.concert_date,
      t.category AS ticket_type
    FROM orders o
    JOIN tickets t ON o.ticket_id = t.ticket_id
    JOIN concerts c ON t.concert_id = c.concert_id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(query, [user_id], (error, results) => {
    if (error) {
      console.error("Error fetching user orders:", error);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    console.log("Hasil query untuk user_id", user_id, ":", results);
    return res.json({ tickets: results });

    
  });
});

module.exports = router;