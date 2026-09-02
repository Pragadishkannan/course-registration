const express = require('express');
const router = express.Router();
const { getSchedule } = require('../controllers/scheduleController');

// GET /api/schedule
router.get('/', getSchedule);

module.exports = router;
