const pool = require('../db/pool');

// Get all courses with calculated seats_remaining
const getCourses = async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, course_name, schedule_time, max_capacity, current_enrolled,
              (max_capacity - current_enrolled) AS seats_remaining
       FROM courses
       ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
};

module.exports = { getCourses };
