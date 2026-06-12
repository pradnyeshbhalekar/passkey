import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="py-4 px-6 shadow-md bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-blue-600 font-jersey10 font-bold text-2xl md:text-3xl">
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
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-xl font-jersey10">
            Home
          </a>
          <a href="/about" className="text-blue-600 hover:text-blue-700 text-xl font-jersey10">
            About
          </a>
          <a href="/faqs" className="text-blue-600 hover:text-blue-700 text-xl font-jersey10">
            FAQs
          </a>

          {userToken && (
            <a href="/settings" className="text-blue-600 hover:text-blue-700 text-xl font-jersey10">
              Security Settings
            </a>
          )}

          {userToken ? (
            <button
              onClick={handleLogout}
              className="text-blue-600 font-jersey10 hover:text-blue-700 text-xl"
            >
              Logout
            </button>
          ) : (
            location.pathname !== "/login" && (
              <a href="/login" className="text-blue-600 font-jersey10 hover:text-blue-700 text-xl">
                Login
              </a>
            )
          )}
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {open && (
        <div className="flex flex-col mt-3 space-y-3 md:hidden">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-lg font-jersey10">
            Home
          </a>
          <a href="/about" className="text-blue-600 hover:text-blue-700 text-lg font-jersey10">
            About
          </a>
          <a href="/faqs" className="text-blue-600 hover:text-blue-700 text-lg font-jersey10">
            FAQs
          </a>

          {userToken && (
            <a href="/settings" className="text-blue-600 hover:text-blue-700 text-lg font-jersey10">
              Security Settings
            </a>
          )}

          {userToken ? (
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-700 text-lg text-left font-jersey10"
            >
              Logout
            </button>
          ) : (
            location.pathname !== "/login" && (
              <a href="/login" className="text-blue-600 hover:text-blue-700 text-lg font-jersey10">
                Login
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;