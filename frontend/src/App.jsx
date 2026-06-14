import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/home";
import Login from "./pages/login";
import PasswordVault from "./pages/passwordvault";
import PasswordGenerate from "./pages/generatepassword";
import Settings from "./pages/settings";
import VerifyMfa from "./pages/verifyMfa";
import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./pages/about";
import FAQs from "./pages/faqs";

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  console.log("Google Client ID:", googleClientId);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/passwordvault" element={<PasswordVault />} />
            <Route path="/generatepassword" element={<PasswordGenerate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/verify-mfa" element={<VerifyMfa />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faqs" element={<FAQs />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;