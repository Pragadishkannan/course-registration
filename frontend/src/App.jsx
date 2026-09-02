import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CourseCatalog from './components/CourseCatalog';
import StudentSchedule from './components/StudentSchedule';
import Toast from './components/Toast';
import { fetchCourses, fetchSchedule, enrollStudent, cancelEnrollment } from './services/api';

function App() {
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [droppingId, setDroppingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Load courses and student schedule on mount
  const loadData = useCallback(async () => {
    try {
      const [coursesData, scheduleData] = await Promise.all([
        fetchCourses(),
        fetchSchedule(),
      ]);
      setCourses(coursesData);
      setSchedule(scheduleData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle enrollment
  const handleEnroll = async (courseId) => {
    setEnrollingCourseId(courseId);

    try {
      const result = await enrollStudent(courseId);
      setToast({ message: result.message, type: 'success' });

      // Refresh course catalog and student schedule
      await loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setEnrollingCourseId(null);
    }
  };

  // Handle dropping a course
  const handleDrop = async (enrollmentId) => {
    setDroppingId(enrollmentId);

    try {
      const result = await cancelEnrollment(enrollmentId);
      setToast({ message: result.message, type: 'success' });

      // Refresh course catalog and schedule
      await loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setDroppingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Catalog - 2/3 width */}
          <div className="lg:col-span-2">
            <CourseCatalog
              courses={courses}
              onEnroll={handleEnroll}
              enrollingCourseId={enrollingCourseId}
              schedule={schedule}
            />
          </div>

          {/* My Schedule - 1/3 width */}
          <div>
            <StudentSchedule 
              schedule={schedule} 
              onDrop={handleDrop}
              droppingId={droppingId}
            />
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
