const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eventName: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
