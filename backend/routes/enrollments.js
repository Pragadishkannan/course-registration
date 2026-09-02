const express = require('express');
const router = express.Router();
const { createEnrollment, cancelEnrollment } = require('../controllers/enrollmentController');

// POST /api/enrollments - Enroll or waitlist
router.post('/', createEnrollment);

// DELETE /api/enrollments/:id - Cancel/Drop enrollment
router.delete('/:id', cancelEnrollment);

module.exports = router;
