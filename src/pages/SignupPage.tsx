import { useState, type FormEvent } from "react";
import AuthLayout from "../components/AuthLayout";

interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialForm: SignupForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function SignupPage() {
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [error, setError] = useState("");

  function updateField(field: keyof SignupForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete every field.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

  const labelClasses = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <AuthLayout
      title="Create your account"
      description="Build your workout plan, log your lifts, and see your progress."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
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
          <label htmlFor="signup-username" className={labelClasses}>
            Username
          </label>

          <input
            required
            id="signup-username"
            type="text"
            value={form.username}
            onChange={(event) => updateField("username", event.target.value)}
            placeholder="Choose a username"
            autoComplete="username"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signup-email" className={labelClasses}>
            Email
          </label>

          <input
            required
            id="signup-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className={labelClasses}>
            Password
          </label>

          <input
            required
            minLength={8}
            id="signup-password"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className={inputClasses}
          />

          <p className="mt-2 text-xs text-slate-500">
            Your password must contain at least 8 characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirm-password" className={labelClasses}>
            Confirm password
          </label>

          <input
            required
            minLength={8}
            id="confirm-password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            placeholder="Enter your password again"
            autoComplete="new-password"
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 active:translate-y-px"
        >
          Create account
        </button>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;
