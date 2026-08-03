import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { useAuthContext } from "../contexts";
import AuthRouter from "./auth/AuthRouter";
// pages
import HomePage from "../pages/HomePage";
// components
import { Spinner } from "../components/misc/loaders";

export default function AppRouter() {
  const { isInitializing, isAuthenticated, user } = useAuthContext();

  if (isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated && !user && (
        <Route path="/auth/*" element={<AuthRouter />} />
      )}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/" : "/auth/login"} replace />
        }
      />
    </Routes>
  );
}
