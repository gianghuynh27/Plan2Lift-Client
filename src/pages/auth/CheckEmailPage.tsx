import { useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout";
import { authService } from "../../services/auth";

type CheckEmailLocationState = {
  email?: string;
  emailSent?: boolean;
  unverifiedEmailLogin?: boolean;
};

function CheckEmailPage() {
  const location = useLocation();

  const locationState = location.state as CheckEmailLocationState | null;

  const cameFromUnverifiedLogin = locationState?.unverifiedEmailLogin === true;
  const [email, setEmail] = useState(locationState?.email ?? "");

  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const initialEmailFailed = locationState?.emailSent === false;

  async function handleResend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter your email address.");
      return;
    }

    setIsResending(true);

    try {
      const response = await authService.resendVerificationEmail({
        email: normalizedEmail,
      });

      setSuccessMessage(response.message);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to request another verification email.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout
      title="Check your email"
      description="Verify your email address before signing in to Plan2Lift."
      footerText="Already verified your email?"
      footerLinkText="Sign in"
      footerLinkTo="/auth/login"
    >
      <div className="space-y-5">
        {initialEmailFailed && !successMessage && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            Your account was created, but the first verification email could not
            be sent. You can request another email below.
          </div>
        )}

        {!initialEmailFailed && !successMessage && !cameFromUnverifiedLogin && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            We sent a verification link to your email address. Open the link to
            activate your account.
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {cameFromUnverifiedLogin && !successMessage && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            Your email address has not been verified. Open your verification
            link, or request a new one below.
          </div>
        )}

        <form onSubmit={handleResend} className="space-y-4">
          <div>
            <label
              htmlFor="verification-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <input
              required
              id="verification-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isResending}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={isResending}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
        </form>

        <p className="text-center text-xs leading-5 text-slate-500">
          The verification link expires after a limited time. Check your spam
          folder if you do not see the email.
        </p>
      </div>
    </AuthLayout>
  );
}

export default CheckEmailPage;
