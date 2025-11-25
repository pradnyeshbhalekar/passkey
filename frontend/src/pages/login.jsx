import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assests/images/login.png";
import '../styles/fonts.css'
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { setUserToken } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const res = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });

    const data = await res.json();
    // console.log("sent token");
    // console.log(data);

 
    setUserToken(data.token);


    navigate("/");
  };

  const handleFailure = () => {
    // console.log("Google Login Failed");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar/>
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={loginImage}
                alt="Security Lock Illustration"
                className="w-96 h-auto"
              />
            </div>

            <div className="w-full md:w-1/2">
              <h1 className="text-5xl font-medium text-blue-600 mb-8 font-jersey10 tracking-wider">
                Your Vault, Just a Click Away
              </h1>
              <div className="flex justify-left">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleFailure}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    <Footer/>
    </div>
  );
};

export default Login;
