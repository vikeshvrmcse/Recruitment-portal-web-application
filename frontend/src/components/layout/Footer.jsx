import React from "react";
import pioneer_logo from "../../assets/pioneer-logo.png";

function Footer() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 border-t bg-white/70 backdrop-blur-md text-gray-600 text-sm sticky bottom-0">
      
      <img
        src={pioneer_logo}
        height={10}
        width={80}
        className="object-contain mx-2"
      />

      <span>© 2026 Recruitment Inc. All rights reserved.</span>
    </div>
  );
}

export default Footer;