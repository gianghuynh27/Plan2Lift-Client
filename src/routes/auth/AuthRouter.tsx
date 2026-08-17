import { Routes, Route } from "react-router-dom";

import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/RegisterPage";
import CheckEmailPage from "../../pages/auth/CheckEmailPage";
import VerifyEmailPage from "../../pages/auth/VerifyEmailPage";

export default function AuthRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
    </Routes>
  );
}

// <Route path="/login" element={<LoginPage />} />
// <Route path="/signup" element={<SignupPage />} />
