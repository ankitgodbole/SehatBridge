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


// Route to get OPD registration data by user ID or email
router.get('/opd/profile/:userId', async (req, res) => {
  const { userId } = req.params; // Extract the user ID from the URL parameter
  
  try {
    // Find the registration data for the given userId (or email if preferred)
    const registrationData = await OPDRegistration.findOne({ email: userId }); // Assuming email is used as userId

    if (!registrationData) {
      return res.status(404).json({ success: false, message: 'No registration found for this user.' });
    }

    res.status(200).json({ success: true, data: registrationData });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
