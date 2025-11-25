import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Lock, Key, ChevronRight } from 'lucide-react';
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import { useAuth } from '../context/AuthContext'; 

function Home() {
  const navigate = useNavigate();
  const { userToken } = useAuth();
  
  useEffect(() => {
    // Log the token when component mounts and when it changes
    // console.log("User Token in Home:", userToken);
  }, [userToken]);

  const handleOpenVault = () => {
    navigate("/passwordvault"); 
  };

  const handleGeneratePassword = () => {
    navigate("/generatepassword"); 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar/>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-5xl font-medium text-blue-600 mb-12 font-jersey10 tracking-wider text-center">
            Choose Your Security Tool
          </h1>
          <div className="grid md:grid-cols-2 gap-12">
            
            <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-100">
              <div className="flex items-center justify-center mb-6">
                <Lock className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-3xl font-jersey10 text-blue-600 mb-4 text-center">
                Password Vault
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Securely store and manage all your passwords in one place. Organize them by categories and access them anywhere.
              </p>
              <div className="flex justify-center">
                <button 
                  className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-jersey15 tracking-wider"
                  onClick={handleOpenVault}
                >
                  Open Vault
                  <ChevronRight className="ml-2" />
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-100">
              <div className="flex items-center justify-center mb-6">
                <Key className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-3xl font-jersey10 text-blue-600 mb-4 text-center">
                Password Generator
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Create strong, unique passwords instantly. Customize length and complexity to meet your security needs.
              </p>
              <div className="flex justify-center">
                <button 
                  className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-jersey15 tracking-wider"
                  onClick={handleGeneratePassword}
                >
                  Generate Password
                  <ChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}

export default Home;