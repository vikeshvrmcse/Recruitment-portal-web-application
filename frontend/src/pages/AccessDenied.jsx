import React from "react";
import { motion } from "framer-motion";
import { FaLock, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate=useNavigate()
  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* Floating background blur circles */}
      <div className="absolute w-72 h-72 bg-red-500/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border shadow-md shadow-slate-200 border-white/20 text-white rounded-2xl px-10 py-12 text-center max-w-md w-full"
      >

        {/* Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-5"
        >
          <FaLock className="text-6xl text-red-400" />
        </motion.div>

        {/* 403 */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold tracking-tight"
        >
          403
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-semibold mt-2"
        >
          Access Denied
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300 text-sm mt-4 leading-relaxed"
        >
          You don’t have permission to access this page.  
          Please contact your administrator if you believe this is a mistake.
        </motion.p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-slate-800 mt-6 mb-2 text-white py-2 rounded-lg hover:shadow-md hover:shadow-slate-800 hover:bg-white transition-all duration-300 text-2xl font-light hover:text-slate-800 flex items-center justify-center"
          onClick={()=>navigate('/')}
        >
          <FaHome className="mx-4"/>
          Go Back Home
        </motion.button>

      </motion.div>
    </div>
  );
};

export default AccessDenied;