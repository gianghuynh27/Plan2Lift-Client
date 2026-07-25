import { useState, type FormEvent } from "react";
import AuthLayout from "../components/AuthLayout";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue tracking your workouts and progress."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkTo="/signup"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email
          </label>

          <input
            required
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
          </div>

          <input
            required
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 active:translate-y-px"
        >
          Sign in
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
