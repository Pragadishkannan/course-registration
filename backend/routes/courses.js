const express = require('express');
const router = express.Router();
const { getCourses } = require('../controllers/courseController');

// GET /api/courses
router.get('/', getCourses);

module.exports = router;
