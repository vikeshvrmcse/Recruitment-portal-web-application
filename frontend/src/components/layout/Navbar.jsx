import React from "react";
import pioneer_logo from "../../assets/pioneer-logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate=useNavigate()
  return (
    <div className="sticky top-0 z-50 flex items-center px-6 py-3 bg-white/70 backdrop-blur-md border-b">
      <img
        src={pioneer_logo}
        height={20}
        width={80}
        className="object-contain mt-1 mx-2 cursor-pointer"
        onClick={()=>navigate('/')}
      />

      <h2 onClick={()=>navigate('/')} className="text-lg font-light text-gray-800 uppercase cursor-pointer">
        Recruitment
      </h2>
    </div>
  );
}

export default Navbar;