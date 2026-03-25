const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /register-event — register a user for an event
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, eventId } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'name, email, phone, and eventId are all required.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Validate phone format (10-15 digits, optional +)
    const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Check if already registered
    const today = new Date().setHours(0, 0, 0, 0);
    const eventDay = new Date(event.date).setHours(0, 0, 0, 0);

    if (eventDay < today) {
      return res.status(400).json({
        success: false,
        message: 'This event has already been completed.',
      });
    }
    const registration = new Registration({
      name,
      email,
      phone,
      eventId,
      eventName: event.name,
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: `Successfully registered for "${event.name}"!`,
      registration,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /register-event — get all registrations (admin)
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().populate('eventId', 'name date location');
    res.json({ success: true, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
