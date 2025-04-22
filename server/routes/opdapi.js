// routes/opdapi.js
const express = require('express');
const router = express.Router();
const OPDRegistration = require('../models/OPDRegistration');
const Counter = require('../models/Counter');  // Adjust the path as necessary



// In-memory store or connect to DB
const opdRegistrations = []; // Replace this with MongoDB/SQL insert later

// Route to register OPD data with unique registration ID
router.post('/opd/register', async (req, res) => {
  const data = req.body;

  if (!data.name || !data.age || !data.email) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Step 1: Get the current counter value and increment it
    const counter = await Counter.findOneAndUpdate(
      { _id: 'registrationId' }, // We're using this ID to track registration IDs
      { $inc: { sequenceValue: 1 } }, // Increment the sequence value
      { new: true, upsert: true } // upsert true to create the document if it doesn't exist
    );

    // Step 2: Generate the new registration ID
    const registrationId = `REG-${counter.sequenceValue}`;

    // Step 3: Save the new registration with the generated registration ID
    const registrationData = new OPDRegistration({
      registrationId,
      ...data, // Spread operator to include other fields from the request
    });

    await registrationData.save(); // Save the registration to DB

    res.status(200).json({
      success: true,
      message: 'OPD registration received successfully!',
      data: registrationData,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
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
router.get('/opd/all', async (req, res) => {
  try {
    const registrations = await OPDRegistration.find();
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching OPD data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;
