const API_BASE = 'http://localhost:5000/api';

// Fetch all courses
export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

// Fetch current student's schedule (enrolled + waitlisted courses)
export async function fetchSchedule() {
  const res = await fetch(`${API_BASE}/schedule`);
  if (!res.ok) throw new Error('Failed to fetch schedule');
  return res.json();
}

// Enroll student in a course
export async function enrollStudent(courseId) {
  const res = await fetch(`${API_BASE}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_id: courseId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Enrollment failed');
  }
  return data;
}

// Drop/Cancel an enrollment
export async function cancelEnrollment(enrollmentId) {
  const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to drop course');
  }
  return data;
}
