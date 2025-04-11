// routes/hospital/hospitalapi.js

const express = require("express");
const router = express.Router();

// Handle POST request for hospital OPD registration or emergencies
router.post("/emergency", (req, res) => {
  const { name, age, symptoms } = req.body;

  // You could validate and store this data in a DB here
  console.log("Received emergency registration:", { name, age, symptoms });

  res.status(201).json({
    success: true,
    message: "Emergency registration received successfully!",
    data: { name, age, symptoms },
  });
});

module.exports = router;
