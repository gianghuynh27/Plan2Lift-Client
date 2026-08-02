import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/use-auth";

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Plan2Lift</p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Welcome, {user?.username}
            </h1>

            <p className="mt-2 text-slate-600">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Log out
          </button>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Workout plans</h2>

            <p className="mt-2 text-slate-600">
              You have not created a workout plan yet.
            </p>

            <button
              type="button"
              disabled
              className="mt-6 cursor-not-allowed rounded-xl bg-slate-300 px-4 py-2 font-semibold text-white"
            >
              Create plan — coming next
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Recent progress
            </h2>

            <p className="mt-2 text-slate-600">
              Your completed workouts will appear here.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
