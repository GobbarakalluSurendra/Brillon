const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Job     = require('../models/Job');

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

// ── GET /jobs — public, returns active listings ────────────────────────────
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /jobs/all — admin: returns ALL listings (including inactive) ────────
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── POST /jobs — admin: create ─────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, department, location, type, level, duration, salary, isActive } = req.body;
    if (!title || !department || !location || !type) {
      return res.status(400).json({ success: false, message: 'title, department, location, and type are required.' });
    }
    const job = new Job({ title, department, location, type, level, duration, salary, isActive });
    await job.save();
    res.status(201).json({ success: true, message: 'Job created.', job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── PUT /jobs/:id — admin: update ─────────────────────────────────────────
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.json({ success: true, message: 'Job updated.', job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── DELETE /jobs/:id — admin: delete ──────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.json({ success: true, message: 'Job deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
