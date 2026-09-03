function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative group flex-shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md shadow-blue-500/15 border border-blue-500/20 bg-[#070b14] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/50 group-hover:shadow-cyan-500/25">
              <img
                src="/logo.png"
                alt="Nool Tech Academy Logo"
                className="w-full h-full object-cover scale-[1.38] -translate-y-[2px]"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Nool Tech Academy
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse available elective courses, check remaining seats, and manage your schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-blue-50/70 border border-blue-100/80 px-3.5 py-1.5 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Logged in as <strong className="text-blue-700 font-semibold">John</strong></span>
        </div>
      </div>
    </header>
  );
}

export default Header;
