import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg px-6 bg-slate-700 rounded-lg shadow-md shadow-slate-300 py-6"
      >

        {/* Icon */}
        <FaExclamationTriangle className="text-6xl text-yellow-400 mx-auto mb-4" />

        {/* 404 */}
        <h1 className="text-7xl font-bold">404</h1>

        {/* Title */}
        <h2 className="text-xl font-semibold mt-2">Page Not Found</h2>

        {/* Description */}
        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-slate-800 text-white py-2 my-6 rounded-lg hover:shadow-md hover:shadow-slate-800 hover:bg-white transition-all duration-300 text-2xl font-light hover:text-slate-800 flex items-center justify-center"
        >
          <FaHome className="mx-4" />
          Go Home
        </button>

      </motion.div>
    </div>
  );
}

export default NotFound;