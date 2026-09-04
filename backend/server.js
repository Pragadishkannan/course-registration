const express = require('express');
const cors = require('cors');
require('dotenv').config();

const courseRoutes = require('./routes/courses');
const scheduleRoutes = require('./routes/schedule');
const enrollmentRoutes = require('./routes/enrollments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    message: 'Nool Tech Academy API is running',
    endpoints: {
      courses: '/api/courses',
      schedule: '/api/schedule',
      enrollments: '/api/enrollments'
    }
  });
});

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Basic error handling
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
