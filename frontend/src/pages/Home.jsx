import React from "react";
import { motion } from "framer-motion";
import { FaApple } from "react-icons/fa";
import { FaArrowRight, FaUser } from "react-icons/fa";
import pioneer_logo from '../assets/pioneer-logo.png'
import { useNavigate } from "react-router-dom";
function Home() {

  const navigate=useNavigate();
  return (
    <div className="min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-100 to-white font-sans">

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-start mt-20 ml-10 text-start px-1">

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-9xl font-bold text-gray-900 mb-10 tracking-tight"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          PIONEER RECRUITMENT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-justify text-gray-600 px-5 font-light text-xl md:py-6 md:my-10"
        >
          To fulfill the free license requirements, please
            read our Reuse guide. You can also request a file or request permission for a file already on the internet.
            Small object detection is a particular case of object detection where various techniques are employed to
             detect small objects in digital images and videos. "Small objects" are objects having a small pixel footprint
              in the input image. In areas such as aerial imagery, state-of-the-art object detection techniques under performed
               because of small objects. This video shows an example of object tracking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-5 mt-10 w-full"
        >
          {/* Primary Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-medium shadow-lg hover:bg-gray-800 transition"
            onClick={()=>navigate('/login')}
          >
            Let’s Start <FaArrowRight />
          </motion.button>

          {/* Secondary Button */}
          <a href="https://www.pmalgroup.com/" target="_blank" rel="noopener noreferrer">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-800 border border-gray-300 shadow-md hover:bg-gray-100 transition"

          >
            About Me <FaUser />
          </motion.button>
          </a>
        </motion.div>
      </div>

      
    </div>
  );
}

export default Home;