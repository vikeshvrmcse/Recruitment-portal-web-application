import React from "react";

const getStatusStyle = (status) => {
  switch (status) {
    case "confirmed":
      return {
        dot: "bg-green-500  animate-spin",
        badge: "bg-green-500",
      };
    case "approve":
      return {
        dot: "bg-green-500 animate-spin",
        badge: "bg-green-500",
      };
    case "cancelled":
      return {
        dot: "bg-red-500  animate-spin",
        badge: "bg-red-500",
      };
    default:
      return {
        dot: "bg-gray-400  animate-spin",
        badge: "bg-gray-400",
      };
  }
};

const Stepper = ({ data = [] }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Requisition Tracking
      </h2>

      {/* Timeline line */}
      <div className="relative border-l-2 border-gray-300 ml-4">

        {data.length === 0 ? (
          <p className="text-gray-500 ml-6">No steps available</p>
        ) : (
          data.map((step, index) => {
            const styles = getStatusStyle(step.status);

            return (
              <div key={step.id || index} className="mb-8 ml-6 relative">

                {/* Dot */}
                <span
                  className={`absolute -left-[38px] flex items-center justify-center w-6 h-6 rounded-full ${styles.dot}`}
                />

                {/* Card */}
                <div className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition">

                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      {step.stepType || "Unknown Step"}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded text-white ${styles.badge}`}
                    >
                      {step.status || "unknown"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <strong>Action By:</strong>{" "}
                      {step.actionBy || "N/A"}
                    </p>

                    {step.nextApprover && (
                      <p className="text-sm text-gray-600">
                        <strong>Next Approver:</strong>{" "}
                        {step.nextApprover}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-400 mt-3">
                    {step.date
                      ? new Date(step.date).toLocaleString()
                      : "No date"}
                  </p>

                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
};

export default Stepper;