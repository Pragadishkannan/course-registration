function CourseCard({ course, onEnroll, isEnrolling, studentSchedule }) {
  const { id, course_name, schedule_time, max_capacity, current_enrolled, seats_remaining } = course;
  const isFull = seats_remaining <= 0;

  // Check if the current student is already enrolled/waitlisted for this course
  const existingEnrollment = studentSchedule.find((s) => s.course_id === id);
  const alreadyRegistered = !!existingEnrollment;

  // Determine button state and label
  let buttonLabel = 'Enroll';
  let buttonClass = 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm';
  let buttonDisabled = false;

  if (alreadyRegistered) {
    buttonLabel = existingEnrollment.status === 'Enrolled' ? '✓ Enrolled' : '⏳ Waitlisted';
    buttonClass = 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed';
    buttonDisabled = true;
  } else if (isFull) {
    buttonLabel = 'Join Waitlist';
    buttonClass = 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-sm';
  }

  if (isEnrolling) {
    buttonLabel = 'Processing...';
    buttonClass = 'bg-gray-300 text-gray-600 cursor-not-allowed animate-pulse';
    buttonDisabled = true;
  }

  // Schedule badge styling
  const scheduleBadgeColors = {
    Morning: 'bg-amber-50 text-amber-700 border-amber-200',
    Afternoon: 'bg-blue-50 text-blue-700 border-blue-200',
    Evening: 'bg-purple-50 text-purple-700 border-purple-200',
  }[schedule_time] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{course_name}</h3>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${scheduleBadgeColors}`}>
            {schedule_time}
          </span>
        </div>

        <div className="space-y-2 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Capacity</span>
            <span className="font-medium text-gray-700">{current_enrolled} / {max_capacity}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Seats Remaining</span>
            <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${
              seats_remaining > 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {seats_remaining > 0 ? `${seats_remaining} ${seats_remaining === 1 ? 'Seat' : 'Seats'} Left` : 'Full'}
            </span>
          </div>
        </div>
      </div>

      <button
        id={`enroll-btn-${id}`}
        onClick={() => onEnroll(id)}
        disabled={buttonDisabled}
        className={`mt-5 w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-150 ${buttonClass}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default CourseCard;
