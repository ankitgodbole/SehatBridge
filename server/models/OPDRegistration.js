const mongoose = require('mongoose');

// Define the schema for OPD Registration
const opdRegistrationSchema = new mongoose.Schema({
  registrationId: { type: String, required: true },  // Add registrationId field
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
  pincode: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: String, required: true },
  report: { type: [String], required: true }, // Array for storing file paths of reports
});

const OPDRegistration = mongoose.model('OPDRegistration', opdRegistrationSchema);

module.exports = OPDRegistration;
