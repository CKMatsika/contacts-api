const mongoose = require('mongoose');

// Define contact schema
const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  favoriteColor: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export model
module.exports = mongoose.model('Contact', contactSchema);