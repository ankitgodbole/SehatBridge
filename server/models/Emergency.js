const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  symptoms: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emergency', emergencySchema);
