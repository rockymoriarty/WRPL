// backend/routes/concertRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../database/db_config");

// Route untuk mendapatkan semua konser
// Karena di server.js kita menggunakan app.use("...", concertRoutes),
// maka endpoint ini akan menjadi root dari path tersebut
router.get("/", (req, res) => {
  console.log("GET request untuk daftar konser");
  const query = "SELECT * FROM concerts";
  
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching concerts:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    
    console.log(`Berhasil mengambil ${results.length} konser dari database`);
    res.json(results);
  });
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


// Route untuk mendapatkan detail konser berdasarkan ID
router.get("/:id", (req, res) => {
  const concertId = req.params.id;
  const query = "SELECT * FROM concerts WHERE concert_id = ?";
  
  db.query(query, [concertId], (error, results) => {
    if (error) {
      console.error("Error fetching concert details:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Concert not found" });
    }
    
    res.json(results[0]);
  });
});

module.exports = router;