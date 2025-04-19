const express = require("express");
const router = express.Router();

// POST /hospitalapi/emergency
router.post("/emergency", (req, res) => {
  const { name, age, symptoms } = req.body;

  if (!name || !age || !symptoms) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  console.log("Emergency received:", req.body);

  res.status(200).json({
    success: true,
    message: "Emergency registration received successfully!",
    data: { name, age, symptoms },
  });
});

module.exports = router;
