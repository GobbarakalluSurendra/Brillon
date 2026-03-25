const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  location:   { type: String, required: true, trim: true },
  type:       { type: String, required: true, enum: ['Full-time', 'Internship'], default: 'Full-time' },
  level:      { type: String, trim: true },          // e.g. Senior, Mid-Senior, Intern
  duration:   { type: String, trim: true },          // Internships only, e.g. "3 months"
  salary:     { type: String, trim: true },          // e.g. "$3,000/mo"
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
