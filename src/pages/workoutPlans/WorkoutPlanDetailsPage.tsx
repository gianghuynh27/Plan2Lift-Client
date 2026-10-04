import {
  ArrowLeft,
  Dumbbell,
  Play,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  workoutPlanService,
  type WorkoutPlan,
} from "../../services/workoutPlans";

export default function WorkoutPlanDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    if (!id) {
      setError("Workout plan ID is missing.");
      setIsLoading(false);
      return;
    }

    void workoutPlanService
      .getWorkoutPlanById(id)
      .then((response) => {
        if (isActive) {
          setPlan(response.data);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        console.error(
          "Unable to load workout plan:",
          requestError,
        );

        if (isActive) {
          setError(
            "Unable to load this workout plan.",
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
  }, [id]);

  if (isLoading) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-slate-600">
          Loading workout plan...
        </div>
      </main>
    );
  }

  if (error || !plan) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p role="alert" className="text-red-700">
            {error || "Workout plan not found."}
          </p>

          <Link
            to="/workout-plans"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-emerald-700"
          >
            <ArrowLeft size={18} />
            Back to workout plans
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/workout-plans"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
        >
          <ArrowLeft size={17} />
          Workout plans
        </Link>

        <header className="mt-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {plan.name}
              </h1>

              {plan.description && (
                <p className="mt-2 text-slate-600">
                  {plan.description}
                </p>
              )}
            </div>

            {plan.isActive && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                Active plan
              </span>
            )}
          </div>
        </header>

        <section className="mt-8 space-y-5">
          {plan.days.map((day, dayIndex) => (
            <article
              key={day._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Workout day {dayIndex + 1}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {day.name}
                  </h2>
                </div>

                <button
                  type="button"
                  disabled
                  title="Workout logging will be implemented next"
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 font-semibold text-slate-500"
                >
                  <Play size={17} />
                  Start workout — coming next
                </button>
              </div>

              {day.exercises.length === 0 ? (
                <p className="mt-5 text-sm text-slate-500">
                  No exercises have been added to this day.
                </p>
              ) : (
                <div className="mt-5 divide-y divide-slate-100">
                  {day.exercises.map(
                    (plannedExercise, exerciseIndex) => {
                      const exercise =
                        plannedExercise.exerciseId;

                      return (
                        <div
                          key={plannedExercise._id}
                          className="flex items-center gap-4 py-4"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                            {exerciseIndex + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900">
                              {exercise?.name ??
                                "Unavailable exercise"}
                            </p>

                            {exercise && (
                              <p className="text-sm text-slate-500">
                                {exercise.muscleGroup}
                                {exercise.equipment
                                  ? ` · ${exercise.equipment}`
                                  : ""}
                              </p>
                            )}
                          </div>

                          <p className="shrink-0 font-semibold text-slate-700">
                            {plannedExercise.targetSets} ×{" "}
                            {plannedExercise.targetReps}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </article>
          ))}
        </section>

        {plan.days.length === 0 && (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Dumbbell
              size={30}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-semibold text-slate-700">
              This plan does not contain any workout days.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}