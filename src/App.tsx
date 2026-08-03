// import { Navigate, Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import { ProtectedRoute } from "./auth/ProtectedRoute";
// import HomePage from "./pages/HomePage";
import AppRouter from "./routes/AppRouter";
import AuthProvider from "./contexts/auth/AuthProvider";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
