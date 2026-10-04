import {
  ChartLine,
  ClipboardList,
  Dumbbell,
  House,
  Utensils,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import { NavLink } from "react-router-dom";

import { useAuthContext } from "../../contexts";

type NavigationItem = {
  label: string;
  shortLabel?: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    path: "/",
    icon: House,
    end: true,
  },
  {
    label: "Workout Plans",
    shortLabel: "Plans",
    path: "/workout-plans",
    icon: Dumbbell,
  },
  {
    label: "Meals",
    path: "/meals",
    icon: Utensils,
  },
  {
    label: "Progress",
    path: "/progress",
    icon: ChartLine,
  },
];

function desktopLinkClasses(isActive: boolean): string {
  const base =
    "flex h-16 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition";

  return isActive
    ? `${base} border-emerald-600 text-emerald-700`
    : `${base} border-transparent text-slate-500 hover:text-slate-900`;
}

function mobileLinkClasses(isActive: boolean): string {
  const base =
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-xs font-semibold transition";

  return isActive ? `${base} text-emerald-700` : `${base} text-slate-500`;
}

export default function Navbar() {
  const { user } = useAuthContext();

  const initial =
    user?.username?.trim().charAt(0).toUpperCase() ||
    user?.email?.trim().charAt(0).toUpperCase() ||
    "M";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="flex items-center gap-2"
            aria-label="Plan2Lift home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white">
              <Dumbbell size={20} />
            </span>

            <span className="text-lg font-bold text-slate-900">Plan2Lift</span>
          </NavLink>

          <nav
            aria-label="Primary navigation"
            className="mx-auto hidden items-center md:flex"
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => desktopLinkClasses(isActive)}
                >
                  <Icon size={19} />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <NavLink
            to="/profile"
            aria-label="Open fitness profile"
            title="Fitness profile"
            className={({ isActive }) =>
              [
                "ml-auto grid h-10 w-10 place-items-center rounded-full font-bold transition",
                isActive
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300",
              ].join(" ")
            }
          >
            {initial}
          </NavLink>
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white md:hidden"
      >
        {navigationItems
          .filter((item) => item.path !== "/progress")
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => mobileLinkClasses(isActive)}
              >
                <Icon size={20} />

                <span>{item.shortLabel ?? item.label}</span>
              </NavLink>
            );
          })}

        <NavLink
          to="/profile"
          className={({ isActive }) => mobileLinkClasses(isActive)}
        >
          <UserRound size={20} />
          <span>Me</span>
        </NavLink>
      </nav>
    </>
  );
}
