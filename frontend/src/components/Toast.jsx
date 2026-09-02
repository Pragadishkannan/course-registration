import { useEffect } from 'react';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success'
    ? 'bg-green-50 border-green-300 text-green-800'
    : 'bg-red-50 border-red-300 text-red-800';

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm border rounded-lg px-4 py-3 shadow-md ${bgColor}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm">{message}</p>
        <button
          onClick={onClose}
          className="text-lg leading-none font-medium opacity-60 hover:opacity-100"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default Toast;
