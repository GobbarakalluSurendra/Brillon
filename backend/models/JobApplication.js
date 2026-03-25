const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle:  { type: String, required: true, trim: true },
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  phone:     { type: String, required: true, trim: true },
  message:   { type: String, trim: true, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
