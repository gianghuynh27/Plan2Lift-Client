import {
  LogOut,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useAuthContext } from "../../contexts";

export default function ProfilePage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const [error, setError] = useState("");

  async function handleLogout() {
    setIsLoggingOut(true);
    setError("");

    try {
      await logout();

      navigate("/auth/login", {
        replace: true,
      });
    } catch (logoutError) {
      console.error(
        "Unable to log out:",
        logoutError,
      );

      setError(
        "Unable to log out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header>
          <p className="text-sm font-semibold text-emerald-700">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Fitness profile
          </h1>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <UserRound size={28} />
          </span>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            {user?.username}
          </h2>

          <p className="mt-1 text-slate-600">
            {user?.email}
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-500">
            {user?.isVerified
              ? "Email verified"
              : "Email not verified"}
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut size={18} />

            {isLoggingOut
              ? "Logging out..."
              : "Log out"}
          </button>
        </section>
      </div>
    </main>
  );
}