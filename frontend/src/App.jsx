import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/home";
import Login from "./pages/login";
import PasswordVault from "./pages/passwordvault";
import PasswordGenerate from "./pages/generatepassword";
import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./pages/about";
import FAQs from "./pages/faqs";

function App() {
  return (
    <GoogleOAuthProvider clientId="163347937921-01e9n4h35ur90tua7aejtsunoa2uubgl.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/passwordvault" element={<PasswordVault />} />
            <Route path="/generatepassword" element={<PasswordGenerate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faqs" element={<FAQs />} />
          </Routes>
        </Router> 
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;