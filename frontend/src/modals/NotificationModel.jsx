import React from "react";

function NotificationModal({ data, onClose }) {
  
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-5 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold">{data.jobTitle}</h2>
        <p className="text-sm text-gray-600 mt-2">
          {data.status}
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default NotificationModal;