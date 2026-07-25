import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

function AuthLayout({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-3 text-emerald-700"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-700 text-xs font-black tracking-wide text-white">
            P2L
          </span>

          <span className="text-xl font-extrabold tracking-tight">
            Plan2Lift
          </span>
        </Link>

        <header className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          <p className="mt-2 leading-6 text-slate-500">{description}</p>
        </header>

        {children}

        <p className="mt-7 text-center text-sm text-slate-500">
          {footerText}{" "}
          <Link
            to={footerLinkTo}
            className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </section>
    </main>
  );
}

export default AuthLayout;