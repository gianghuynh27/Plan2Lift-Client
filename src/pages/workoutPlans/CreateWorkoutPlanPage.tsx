import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  exerciseService,
  type Exercise,
} from '../../services/exercises';

import {
  workoutPlanService,
} from '../../services/workoutPlans';

function CreateWorkoutPlanPage() {
  const navigate = useNavigate();

  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [planName, setPlanName] =
    useState('');

  const [dayName, setDayName] =
    useState('');

  const [
    selectedExerciseId,
    setSelectedExerciseId,
  ] = useState('');

  const [targetSets, setTargetSets] =
    useState(3);

  const [targetReps, setTargetReps] =
    useState(8);

  const [error, setError] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadExercises() {
      try {
        const response =
          await exerciseService.getExercises();

        if (isActive) {
          setExercises(
            response.data,
          );
        }
      } catch (error) {
        console.error(
          'Unable to load exercises:',
          error,
        );

        if (isActive) {
          setError(
            'Unable to load exercises.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadExercises();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError('');

    if (
      !planName.trim() ||
      !dayName.trim() ||
      !selectedExerciseId
    ) {
      setError(
        'Enter a plan name, day name, and exercise.',
      );

      return;
    }

    if (
      targetSets < 1 ||
      targetReps < 1
    ) {
      setError(
        'Target sets and reps must be at least 1.',
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await workoutPlanService
        .createWorkoutPlan({
          name: planName.trim(),

          isActive: true,

          days: [
            {
              name:
                dayName.trim(),

              exercises: [
                {
                  exerciseId:
                    selectedExerciseId,

                  targetSets,

                  targetReps,
                },
              ],
            },
          ],
        });

      navigate('/', {
        replace: true,
      });
    } catch (error) {
      console.error(
        'Unable to create workout plan:',
        error,
      );

      setError(
        'Unable to create workout plan.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <p>Loading exercises...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() =>
            navigate('/')
          }
          className="mb-6 text-sm font-semibold text-emerald-700"
        >
          Back to home
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Create workout plan
          </h1>

          <p className="mt-2 text-slate-600">
            Choose an exercise and set your target sets and reps.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="plan-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Plan name
              </label>

              <input
                required
                id="plan-name"
                value={planName}
                onChange={(event) =>
                  setPlanName(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Strength Plan"
              />
            </div>

            <div>
              <label
                htmlFor="day-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Day name
              </label>

              <input
                required
                id="day-name"
                value={dayName}
                onChange={(event) =>
                  setDayName(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Push Day"
              />
            </div>

            <div>
              <label
                htmlFor="exercise"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Exercise
              </label>

              <select
                required
                id="exercise"
                value={
                  selectedExerciseId
                }
                onChange={(event) =>
                  setSelectedExerciseId(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="">
                  Select an exercise
                </option>

                {exercises.map(
                  (exercise) => (
                    <option
                      key={
                        exercise._id
                      }
                      value={
                        exercise._id
                      }
                    >
                      {exercise.name}
                      {' — '}
                      {
                        exercise.muscleGroup
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="target-sets"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Target sets
                </label>

                <input
                  required
                  id="target-sets"
                  type="number"
                  min={1}
                  step={1}
                  value={targetSets}
                  onChange={(event) =>
                    setTargetSets(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="target-reps"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Target reps
                </label>

                <input
                  required
                  id="target-reps"
                  type="number"
                  min={1}
                  step={1}
                  value={targetReps}
                  onChange={(event) =>
                    setTargetReps(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                exercises.length === 0
              }
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Creating...'
                : 'Create workout plan'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateWorkoutPlanPage;