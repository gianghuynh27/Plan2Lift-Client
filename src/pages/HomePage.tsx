import {
  ArrowRight,
  Dumbbell,
  ListChecks,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import { useAuthContext } from "../contexts";

import {
  workoutPlanService,
  type WorkoutPlan,
} from "../services/workoutPlans";

function HomePage() {
  const { user } = useAuthContext();

  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    void workoutPlanService
      .getWorkoutPlans()
      .then((response) => {
        if (isActive) {
          setPlans(response.data);
          setLoadError("");
        }
      })
      .catch((error: unknown) => {
        console.error(
          "Unable to load workout plans:",
          error,
        );

        if (isActive) {
          setLoadError(
            "Unable to load your workout plans.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const activePlan =
    plans.find((plan) => plan.isActive) ?? null;

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {!user?.isVerified && (
          <section
            role="alert"
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Please verify your email address to access every
            Plan2Lift feature.
          </section>
        )}

        <header>
          <p className="text-sm font-semibold text-emerald-700">
            Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.username}
          </h1>

          <p className="mt-2 text-slate-600">
            Build your routine and keep moving forward.
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <Dumbbell size={22} />
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Active workout plan
                </p>

                <h2 className="text-xl font-bold text-slate-900">
                  {isLoading
                    ? "Loading..."
                    : activePlan?.name ?? "No active plan"}
                </h2>
              </div>
            </div>

            {loadError ? (
              <p className="mt-5 text-sm text-red-700">
                {loadError}
              </p>
            ) : activePlan ? (
              <>
                {activePlan.description && (
                  <p className="mt-5 text-slate-600">
                    {activePlan.description}
                  </p>
                )}

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  {activePlan.days.length} workout{" "}
                  {activePlan.days.length === 1
                    ? "day"
                    : "days"}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/workout-plans/${activePlan._id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800"
                  >
                    View plan
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/workout-plans"
                    className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    All plans
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="mt-5 text-slate-600">
                  Create a workout plan before you begin logging
                  workouts.
                </p>

                <Link
                  to="/workout-plans/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800"
                >
                  <Plus size={18} />
                  Create workout plan
                </Link>
              </>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-700">
                <ListChecks size={22} />
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Workout plans
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {isLoading ? "—" : plans.length}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/workout-plans"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
              >
                View workout plans
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/workout-plans/new"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
              >
                Create a plan
                <Plus size={17} />
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Recent workouts
          </h2>

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center">
            <Dumbbell
              size={30}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-semibold text-slate-700">
              No workouts logged yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Open a workout plan and select a workout day to
              begin.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;