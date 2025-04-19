// routes/opdapi.js
const express = require('express');
const router = express.Router();

// In-memory store or connect to DB
const opdRegistrations = []; // Replace this with MongoDB/SQL insert later

router.post('/opd/register', (req, res) => {
  const data = req.body;
  
  if (!data.name || !data.age || !data.email) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Save to in-memory array (or DB)
  opdRegistrations.push(data);

  res.status(200).json({
    success: true,
    message: 'OPD registration received successfully!',
    data,
  });
});

module.exports = router;
