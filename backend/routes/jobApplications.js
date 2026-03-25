const express        = require('express');
const router         = express.Router();
const jwt            = require('jsonwebtoken');
const JobApplication = require('../models/JobApplication');
const Job            = require('../models/Job');

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// ── Auth middleware ────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

// ── POST /apply-job — public: submit application ───────────────────────────
router.post('/', async (req, res) => {
  try {
    const { jobId, jobTitle, name, email, phone, message } = req.body;

    if (!jobId || !jobTitle || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'jobId, jobTitle, name, email, and phone are required.',
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Validate phone (7–15 digits, optional +, spaces, dashes, parens)
    const phoneRegex = /^\+?[\d\s()\-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    }

    // Confirm the job actually exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const application = new JobApplication({ jobId, jobTitle, name, email, phone, message });
    await application.save();

    res.status(201).json({
      success: true,
      message: `Application submitted for "${jobTitle}"!`,
      application,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /apply-job — admin: list all applications ─────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── DELETE /apply-job/:id — admin: delete one application ─────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
