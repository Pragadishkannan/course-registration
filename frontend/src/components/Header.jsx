function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Course Registration Engine
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Browse available elective courses, check remaining seats, and manage your schedule
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Logged in as <strong className="text-blue-700 font-semibold">John</strong></span>
        </div>
      </div>
    </header>
  );
}

export default Header;
