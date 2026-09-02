import CourseCard from './CourseCard';

function CourseCatalog({ courses, onEnroll, enrollingCourseId, schedule }) {
  if (courses.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        Loading courses...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Course Catalog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={onEnroll}
            isEnrolling={enrollingCourseId === course.id}
            studentSchedule={schedule}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseCatalog;
