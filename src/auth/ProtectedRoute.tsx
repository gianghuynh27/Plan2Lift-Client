import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "../contexts";

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuthContext();

  const location = useLocation();

  if (isInitializing) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-slate-600">Loading your account...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
