import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../../components/AuthLayout";
import { authService } from "../../services/auth";

type VerificationStatus = "ready" | "verifying" | "success" | "error";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;

    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to verify your email address.";
}

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const verificationStarted = useRef(false);

  const [status, setStatus] = useState<VerificationStatus>(
    token ? "ready" : "error",
  );

  const [message, setMessage] = useState(
    token
      ? "Verifying your email address..."
      : "The verification link is missing its token.",
  );

  useEffect(() => {
    if (!token || verificationStarted.current) {
      return;
    }

    // Prevent React Strict Mode from sending the
    // verification request twice during development.
    verificationStarted.current = true;

    async function verifyEmail() {
      try {
        const response = await authService.verifyEmail(token as string);

        setStatus("success");
        setMessage(response.message);
      } catch (error) {
        setStatus("error");
        setMessage(getErrorMessage(error));
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <AuthLayout
      title="Verify your email"
      description="Activating your Plan2Lift account."
      footerText="Already verified your email?"
      footerLinkText="Sign in"
      footerLinkTo="/auth/login"
    >
      <div className="space-y-5">
        {status === "verifying" && (
          <div
            role="status"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm text-slate-700"
          >
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

            {message}
          </div>
        )}

        {status === "success" && (
          <>
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800"
            >
              {message}
            </div>

            <Link
              to="/auth/login"
              className="block w-full rounded-xl bg-emerald-700 px-4 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Continue to sign in
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
            >
              {message}
            </div>

            <Link
              to="/auth/check-email"
              className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Request another verification email
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default VerifyEmailPage;
