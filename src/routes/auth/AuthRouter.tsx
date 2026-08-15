import { Routes, Route } from "react-router-dom";

import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import CheckEmailPage from "../../pages/auth/CheckEmailPage";

export default function AuthRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
    </Routes>
  );
}

// <Route path="/login" element={<LoginPage />} />
// <Route path="/signup" element={<SignupPage />} />
