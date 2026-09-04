const pool = require('../db/pool');

const DEFAULT_STUDENT_ID = 1;

// Get current student's enrolled and waitlisted courses
const getSchedule = async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id AS enrollment_id, e.status,
              c.id AS course_id, c.course_name, c.schedule_time
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1
       ORDER BY c.schedule_time`,
      [DEFAULT_STUDENT_ID]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ error: 'Failed to fetch schedule.' });
  }
};

module.exports = { getSchedule };
