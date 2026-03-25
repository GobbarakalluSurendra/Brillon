require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const eventsRouter = require('./routes/events');
const registrationsRouter = require('./routes/registrations');
const loginRouter = require('./routes/login');
const jobsRouter            = require('./routes/jobs');
const jobApplicationsRouter = require('./routes/jobApplications');
const consentRouter = require('./routes/consent');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/events_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventsRouter);
app.use('/register-event', registrationsRouter);
app.use('/', loginRouter);
app.use('/jobs',      jobsRouter);
app.use('/apply-job', jobApplicationsRouter);
app.use('/api', consentRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎉 Events API is running!', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
