import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="py-4 px-6 shadow-md bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <a href="/" className="text-blue-600 font-bold text-2xl md:text-3xl">
          PASSKEY
        </a>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-blue-600 text-3xl font-bold"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-xl">Home</a>
          <a href="/about" className="text-blue-600 hover:text-blue-700 text-xl">About</a>
          <a href="/faqs" className="text-blue-600 hover:text-blue-700 text-xl">FAQs</a>

          {location.pathname !== "/login" && (
            <button onClick={handleLogout} className="text-blue-600 hover:text-blue-700 text-xl">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {open && (
        <div className="flex flex-col mt-3 space-y-3 md:hidden">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-lg">Home</a>
          <a href="/about" className="text-blue-600 hover:text-blue-700 text-lg">About</a>
          <a href="/faqs" className="text-blue-600 hover:text-blue-700 text-lg">FAQs</a>

          {location.pathname !== "/login" && (
            <button onClick={handleLogout} className="text-blue-600 hover:text-blue-700 text-lg text-left">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
