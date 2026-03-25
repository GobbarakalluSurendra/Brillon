const mongoose = require("mongoose");

const consentSchema = new mongoose.Schema({
  consent: {
    type: String, // "accepted" or "necessary"
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Consent", consentSchema);