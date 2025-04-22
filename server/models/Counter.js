// models/counter.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the counter
const counterSchema = new Schema({
  _id: { type: String, required: true },  // We'll use a unique string ID, like 'registrationId'
  sequenceValue: { type: Number, default: 0 },  // Start the counter at 0
});

// Export the model
module.exports = mongoose.model('Counter', counterSchema);
