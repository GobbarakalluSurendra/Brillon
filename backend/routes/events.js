const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /events — fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /events — add new event
router.post('/', async (req, res) => {
  try {
    const { name, date, location, description, image, category } = req.body;

    if (!name || !date || !location || !description) {
      return res.status(400).json({ success: false, message: 'name, date, location, and description are required.' });
    }

    const event = new Event({ name, date, location, description, image, category });
    await event.save();
    res.status(201).json({ success: true, message: 'Event created', event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /events/:id — update event
router.put('/:id', async (req, res) => {
  try {
    const { name, date, location, description, image, category } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { name, date, location, description, image, category },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event updated', event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /events/:id — delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
