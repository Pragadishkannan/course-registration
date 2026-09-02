function StudentSchedule({ schedule, onDrop, droppingId }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">
          My Schedule
        </h2>
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
          {schedule.length} {schedule.length === 1 ? 'Course' : 'Courses'}
        </span>
      </div>

      {schedule.length === 0 ? (
        <div className="py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm font-medium">No courses registered yet.</p>
          <p className="text-xs text-gray-400 mt-1">Select a course from the catalog to enroll.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((item) => (
            <div
              key={item.enrollment_id}
              className="p-3.5 border border-gray-100 rounded-lg bg-gray-50/60 hover:bg-gray-50 transition-colors flex items-center justify-between gap-2"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.course_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.schedule_time}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'Enrolled'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {item.status === 'Enrolled' ? '✓ Enrolled' : '⏳ Waitlisted'}
                </span>

                <button
                  onClick={() => onDrop(item.enrollment_id)}
                  disabled={droppingId === item.enrollment_id}
                  className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded font-medium border border-transparent hover:border-red-200 transition-all"
                  title="Drop this course"
                >
                  {droppingId === item.enrollment_id ? 'Dropping...' : 'Drop'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentSchedule;
