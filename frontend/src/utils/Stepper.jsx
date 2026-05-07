import axios from "axios";
import { useScroll } from "framer-motion";
import React, { useEffect, useState } from "react";

const API_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL
const getStatusStyle = (status) => {
  switch (status) {
    case "created":
      return {
        dot: "bg-blue-600 border-4 border-dotted  animate-spin",
        badge: "bg-blue-500",
      };
    case "pending":
      return {
        dot: "bg-orange-600 border-4 border-dotted  animate-spin",
        badge: "bg-orange-500",
      };
    case "approved":
      return {
        dot: "bg-green-500 border-4 border-dotted animate-spin",
        badge: "bg-green-500",
      };
    case "rejected":
      return {
        dot: "bg-red-500 border-4 border-dotted animate-spin",
        badge: "bg-red-500",
      };
    default:
      return {
        dot: "bg-gray-400 border-4 border-dotted animate-spin",
        badge: "bg-gray-400",
      };
  }
};

const Stepper = ({ data }) => {


  const [trdata, setData] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const value = '61d2310e-44e2-43d7-8362-7ed08aea6fe8'
      try {
        const response = await axios.get(`${API_BACKEND_URL}/SubAdminAproval/employee-requisition-chain/${data}`)
        setData(response.data)
      } catch (error) {
        console.log(error.message)
      }
    }

    fetch()
  }, [data])

  return (
    <div className="w-full mx-auto p-4 my-4">

      {/* Timeline line */}
      <div className="relative border-l-2 border-gray-300 ml-4">

        {trdata.length === 0 ? (
          <p className="text-gray-500 ml-6">No steps available</p>
        ) : (
          trdata.map((step, index) => {
            const styles = getStatusStyle(step?.status);

            return (
              <div key={index} className="">
                <div key={index} className="mb-8 ml-6 relative">

                  {/* Dot */}
                  <div className={`absolute -left-[38px] flex items-center justify-center w-6 h-6 rounded-full `}>
                    <div className={`absolute ${styles.dot} border-4 border-dotted animate-spin inset-0 rounded-full`}></div>
                    <span
                      className={`z-50 text-white font-bold`}
                    > {step?.stepOrder || "Unknown Step"} </span> </div>

                  {/* Card */}
                  <div className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        Step {step?.stepOrder || "Unknown Step"}
                      </h3>


                      <span
                        className={`text-xs px-2 py-1 rounded text-white ${styles.badge}`}
                      >
                        {step.status && `${step.status[0].toUpperCase() + step.status.substring(1).toLowerCase()}` || "unknown"}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong className="text-md touch-pan-up">{step.status && (step.status !== 'approved' ? `${step.status[0].toUpperCase() + step.status.substring(1)} By:  ${step.empName[0].toUpperCase() + step.empName.substring(1).toLowerCase()}` : "Approved By:")}</strong>{" "}
                        {step?.status !== 'approved' ? "" : step?.empName || "N/A"}
                      </p>

                      {step.nextApprover && (
                        <p className="text-sm text-gray-600">
                          <strong>Next Approver:</strong>{" "}
                          {step?.nextApprover}
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-400 mt-3">
                      {step.updatedAt?.split("T")[0]
                        ? new Date(step.updatedAt?.split("T")[0]).toLocaleString()
                        : "No date"}
                    </p>

                  </div>
                </div>

                {(step.irb === 'PMA0001' && step.status === 'approved') && <div key={step.status} className="mb-8 ml-6 relative">

                  {/* Dot */}

                  <div className={`absolute -left-[38px] flex items-center justify-center w-6 h-6 rounded-full`}>
                    <div className={`absolute ${styles.dot} inset-0 rounded-full`}></div>
                    <span
                      className={`z-50 animate-none text-white font-bold`}
                    >{step?.stepOrder + 1 || "Unknown Step"}

                    </span>
                  </div>
                  {/* Card */}
                  <div className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800 ">
                        Step {step?.stepOrder + 1 || "Unknown Step"}
                      </h3>

                      {/* <span
                        className={`text-xs px-2 py-1 rounded text-white ${styles.badge}`}
                      >
                        {step.status && `${step.status[0].toUpperCase() + step.status.substring(1).toLowerCase()}` || "unknown"}
                      </span> */}
                    </div>

                    {/* Body */}
                    <div className="mt-2 space-y-1">
                      Done
                    </div>
                    <div className={`absolute -left-[38px] flex items-center justify-center w-6 h-6 rounded-full`}>
                      <div className={`absolute border-4 border-dotted animate-spin inset-0 bg-black rounded-full`}></div>
                      <span
                        className={`z-50 animate-none text-white font-bold`}
                      >{step?.stepOrder + 2 || "Unknown Step"} </span>
                    </div>
                  </div>
                </div>}
              </div>);
          })
        )}

      </div>
    </div>
  );
};

export default Stepper;