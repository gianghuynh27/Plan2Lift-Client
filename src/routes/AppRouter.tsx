import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { useAuthContext } from "../contexts";
import AuthRouter from "./auth/AuthRouter";
// pages
import HomePage from "../pages/HomePage";
// components
import { Spinner } from "../components/misc/loaders";
import CreateWorkoutPlanPage from "../pages/workoutPlans/CreateWorkoutPlanPage";
import { ChartLine, Settings, Utensils } from "lucide-react";
import ComingSoonPage from "../pages/misc/ComingSoonPage";
import ProfilePage from "../pages/profile/ProfilePage";
import WorkoutPlanDetailsPage from "../pages/workoutPlans/WorkoutPlanDetailsPage";
import WorkoutPlansPage from "../pages/workoutPlans/WorkoutPlansPage";
import { AppLayout } from "../components/layout";

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
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/workout-plans"
            element={<WorkoutPlansPage />}
          />

          <Route
            path="/workout-plans/new"
            element={<CreateWorkoutPlanPage />}
          />

          <Route
            path="/workout-plans/:id"
            element={<WorkoutPlanDetailsPage />}
          />

          <Route
            path="/meals"
            element={
              <ComingSoonPage
                title="Meals"
                description="Meal planning and food logging will be added after the core workout flow."
                icon={Utensils}
              />
            }
          />

        

          <Route
            path="/progress"
            element={
              <ComingSoonPage
                title="Progress"
                description="Exercise, workout, and body-weight progress will appear here."
                icon={ChartLine}
              />
            }
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/settings"
            element={
              <ComingSoonPage
                title="Settings"
                description="Account and application settings will appear here."
                icon={Settings}
              />
            }
          />
        </Route>
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
