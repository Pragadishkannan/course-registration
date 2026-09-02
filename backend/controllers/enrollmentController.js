const pool = require('../db/pool');

const DEFAULT_STUDENT_ID = 1;

// Create an enrollment (enroll or waitlist)
const createEnrollment = async (req, res) => {
  const { course_id } = req.body;
  const student_id = req.body.student_id || DEFAULT_STUDENT_ID;

  if (!course_id) {
    return res.status(400).json({ error: 'course_id is required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Validate student
    const studentResult = await client.query(
      'SELECT id, name FROM students WHERE id = $1',
      [student_id]
    );
    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Student not found.' });
    }
    const student = studentResult.rows[0];

    // Step 2: Validate course and lock the row for safe capacity check
    const courseResult = await client.query(
      'SELECT id, course_name, schedule_time, max_capacity, current_enrolled FROM courses WHERE id = $1 FOR UPDATE',
      [course_id]
    );
    if (courseResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Course not found.' });
    }
    const course = courseResult.rows[0];

    // Step 3: Check duplicate enrollment
    const duplicateCheck = await client.query(
      'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [student_id, course_id]
    );
    if (duplicateCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'You are already enrolled or waitlisted for this course.'
      });
    }

    // Step 4: Check schedule conflict (both Enrolled and Waitlisted count)
    const conflictCheck = await client.query(
      `SELECT e.id, c.course_name, c.schedule_time
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1 AND c.schedule_time = $2`,
      [student_id, course.schedule_time]
    );
    if (conflictCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: `You already have a course scheduled at ${course.schedule_time}.`
      });
    }

    // Step 5: Check capacity and decide status
    let status;
    if (course.current_enrolled < course.max_capacity) {
      status = 'Enrolled';

      // Increment current_enrolled
      await client.query(
        'UPDATE courses SET current_enrolled = current_enrolled + 1 WHERE id = $1',
        [course_id]
      );
    } else {
      status = 'Waitlisted';
      // Do NOT increment current_enrolled
    }

    // Insert enrollment record
    await client.query(
      'INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, $3)',
      [student_id, course_id, status]
    );

    await client.query('COMMIT');

    let message;
    if (status === 'Enrolled') {
      message = `Successfully enrolled in ${course.course_name}.`;
    } else {
      message = `${course.course_name} is full. You have been added to the waitlist.`;
    }

    res.status(201).json({
      message,
      enrollment: {
        student_name: student.name,
        course_name: course.course_name,
        schedule_time: course.schedule_time,
        status
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating enrollment:', err);
    res.status(500).json({ error: 'Failed to process enrollment.' });
  } finally {
    client.release();
  }
};

// Cancel/Drop an enrollment
const cancelEnrollment = async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if enrollment exists
    const enrollmentResult = await client.query(
      'SELECT id, student_id, course_id, status FROM enrollments WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (enrollmentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Enrollment record not found.' });
    }

    const enrollment = enrollmentResult.rows[0];

    // Delete enrollment
    await client.query('DELETE FROM enrollments WHERE id = $1', [id]);

    // If status was 'Enrolled', decrement current_enrolled count
    if (enrollment.status === 'Enrolled') {
      await client.query(
        'UPDATE courses SET current_enrolled = GREATEST(current_enrolled - 1, 0) WHERE id = $1',
        [enrollment.course_id]
      );
    }

    await client.query('COMMIT');

    res.json({ message: 'Course dropped successfully.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error cancelling enrollment:', err);
    res.status(500).json({ error: 'Failed to drop course.' });
  } finally {
    client.release();
  }
};

module.exports = { createEnrollment, cancelEnrollment };
