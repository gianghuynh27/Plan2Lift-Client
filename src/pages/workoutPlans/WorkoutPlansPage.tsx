import {
  ArrowRight,
  Dumbbell,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  workoutPlanService,
  type WorkoutPlan,
} from "../../services/workoutPlans";

export default function WorkoutPlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let isActive = true;

    void workoutPlanService
      .getWorkoutPlans()
      .then((response) => {
        if (isActive) {
          setPlans(response.data);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        console.error(
          "Unable to load workout plans:",
          requestError,
        );

        if (isActive) {
          setError(
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
  }, [retryVersion]);

  function retry() {
    setIsLoading(true);
    setError("");
    setRetryVersion((current) => current + 1);
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Training
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Workout plans
            </h1>

            <p className="mt-2 text-slate-600">
              Select a plan to view its workout days.
            </p>
          </div>

          <Link
            to="/workout-plans/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800"
          >
            <Plus size={18} />
            Create plan
          </Link>
        </header>

        {isLoading && (
          <p className="mt-10 text-slate-600">
            Loading workout plans...
          </p>
        )}

        {error && (
          <section
            role="alert"
            className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <p className="text-red-700">{error}</p>

            <button
              type="button"
              onClick={retry}
              className="mt-3 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </section>
        )}

        {!isLoading && !error && plans.length === 0 && (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Dumbbell
              size={34}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No workout plans yet
            </h2>

            <p className="mt-2 text-slate-600">
              Create your first plan to organize your training.
            </p>

            <Link
              to="/workout-plans/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white"
            >
              <Plus size={18} />
              Create workout plan
            </Link>
          </section>
        )}

        {!isLoading && !error && plans.length > 0 && (
          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Link
                key={plan._id}
                to={`/workout-plans/${plan._id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Dumbbell size={21} />
                  </span>

                  {plan.isActive && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      Active
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  {plan.name}
                </h2>

                {plan.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {plan.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    {plan.days.length}{" "}
                    {plan.days.length === 1 ? "day" : "days"}
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700"
                  />
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}