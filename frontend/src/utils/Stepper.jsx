import React from "react";

const Stepper = ({ steps }) => {
    const getStatusStyles = (status) => {
      switch (status) {
        case "confirmed":
          return "bg-green-500 text-white";
        case "review":
          return "bg-blue-500 text-white animate-pulse";
        case "cancelled":
          return "bg-red-500 text-white";
        default:
          return "bg-gray-300 text-gray-700";
      }
    };
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center">
            
            {/* Step Circle */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${getStatusStyles(
                  step.status
                )}`}
              >
                {index + 1}
              </div>

              {/* Name */}
              <p className="mt-2 text-sm font-semibold">{step.name}</p>
              <p className="text-xs text-gray-500">{step.role}</p>

              {/* Status */}
              <span
                className={`mt-1 px-2 py-1 text-xs rounded ${getStatusStyles(
                  step.status
                )}`}
              >
                {step.status.toUpperCase()}
              </span>

              {/* Date */}
              {step.date && (
                <p className="text-xs text-gray-400 mt-1">
                  {step.date}
                </p>
              )}
            </div>

            {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-300">
                <div
                  className={`h-1 ${
                    step.status === "confirmed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;