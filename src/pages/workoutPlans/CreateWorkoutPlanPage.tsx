import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { exerciseService, type Exercise } from '../../services/exercises';
import { workoutPlanService } from '../../services/workoutPlans';
import type { CreateWorkoutPlanInput, PlannedExerciseInput } from '../../services/workoutPlans/Types';

// Draft IDs identify UI entries, not database records. Two entries can reference
// the same exerciseId while keeping independent targets.
type DraftExercise = {
  entryId: string;
  exerciseId: string;
  // Strings let users temporarily clear a controlled number input while editing.
  targetSets: string;
  targetReps: string;
  targetWeight: string;
};

type DraftDay = {
  draftId: string;
  name: string;
  exercises: DraftExercise[];
};

function createExerciseEntry(): DraftExercise {
  return {
    entryId: crypto.randomUUID(),
    exerciseId: '',
    targetSets: '3',
    targetReps: '8',
    targetWeight: '',
  };
}

const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3';
const labelClass = 'mb-2 block text-sm font-semibold text-slate-700';
const removeButtonClass = 'rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60';
const addButtonClass = 'rounded-xl border border-emerald-700 px-4 py-2 font-semibold text-emerald-700 disabled:opacity-60';

function CreateWorkoutPlanPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [planName, setPlanName] = useState('');
  // Nesting records membership: each day owns its exercise entries.
  // The draft stays in memory until Save plan; refreshing discards it.
  const [days, setDays] = useState<DraftDay[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;
    async function loadExercises() {
      try {
        const response = await exerciseService.getExercises();
        if (isActive) setExercises(response.data);
      } catch (error) {
        console.error('Unable to load exercises:', error);
        if (isActive) setError('Unable to load exercises.');
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    void loadExercises();
    return () => { isActive = false; };
  }, []);

  function addDay() {
    // Generate IDs outside the updater so it stays pure if React calls it twice.
    const day: DraftDay = {
      draftId: crypto.randomUUID(),
      name: '',
      exercises: [createExerciseEntry()],
    };
    setDays((current) => [...current, day]);
  }

  function removeDay(dayId: string) {
    // filter creates a new array without this day and its nested draft entries.
    // Removing unsaved data does not require a backend delete request.
    setDays((current) => current.filter((day) => day.draftId !== dayId));
  }

  function removeExercise(dayId: string, entryId: string) {
    // Copy the selected day and exclude only the matching entry. Using entryId
    // preserves other entries that reference the same library exercise.
    setDays((current) => current.map((day) =>
      day.draftId === dayId
        ? {
            ...day,
            exercises: day.exercises.filter((entry) => entry.entryId !== entryId),
          }
        : day,
    ));
  }

  function updateDayName(dayId: string, name: string) {
    setDays((current) => current.map((day) =>
      day.draftId === dayId ? { ...day, name } : day,
    ));
  }

  function addExercise(dayId: string) {
    const entry = createExerciseEntry();
    setDays((current) => current.map((day) =>
      day.draftId === dayId
        ? { ...day, exercises: [...day.exercises, entry] }
        : day,
    ));
  }

  function updateExercise(
    dayId: string,
    entryId: string,
    field: 'exerciseId' | 'targetSets' | 'targetReps' | 'targetWeight',
    value: string,
  ) {
    // Read the latest state and copy only the changed path. Matching both IDs
    // prevents an edit from changing another occurrence of the same exercise.
    setDays((current) => current.map((day) =>
      day.draftId === dayId
        ? {
            ...day,
            exercises: day.exercises.map((entry) =>
              entry.entryId === entryId ? { ...entry, [field]: value } : entry,
            ),
          }
        : day,
    ));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');

    if (!planName.trim()) {
      setError('Enter a plan name.');
      return;
    }
    if (days.length === 0) {
      setError('Add at least one day to your plan.');
      return;
    }
    for (const [dayIndex, day] of days.entries()) {
      if (!day.name.trim() || day.exercises.length === 0) {
        setError(`Day ${dayIndex + 1} needs a name and at least one exercise.`);
        return;
      }
      for (const [entryIndex, entry] of day.exercises.entries()) {
        if (!exercises.some((exercise) => exercise._id === entry.exerciseId)) {
          setError(`Select exercise ${entryIndex + 1} in day ${dayIndex + 1}.`);
          return;
        }
        const targets = [Number(entry.targetSets), Number(entry.targetReps)];
        // Blank means unspecified; a supplied weight may be zero or fractional.
        const weight = entry.targetWeight.trim();
        if (weight !== '' && (!Number.isFinite(Number(weight)) || Number(weight) < 0)) {
          setError(`Day ${dayIndex + 1}, exercise ${entryIndex + 1}: weight must be a nonnegative number in pounds.`);
          return;
        }
        if (targets.some((value) => !Number.isInteger(value) || value < 1)) {
          setError(`Day ${dayIndex + 1}, exercise ${entryIndex + 1}: sets and reps must be positive whole numbers.`);
          return;
        }
      }
    }

    // Explicitly build the API shape, excluding local IDs and converting input
    // strings to numbers. MongoDB generates IDs for the saved days and entries.
    const input: CreateWorkoutPlanInput = {
      name: planName.trim(),
      isActive: true,
      days: days.map((day) => ({
        name: day.name.trim(),
        exercises: day.exercises.map((entry) => {
          const exercise: PlannedExerciseInput = {
            exerciseId: entry.exerciseId,
            targetSets: Number(entry.targetSets),
            targetReps: Number(entry.targetReps),
          };
          const weight = entry.targetWeight.trim();
          // Do not convert blank to zero. Add the property only when supplied;
          // an intentional "0" still passes this check and is sent as 0.
          if (weight !== '') {
            exercise.targetWeight = Number(weight);
          }
          return exercise;
        }),
      })),
    };

    setIsSubmitting(true);
    try {
      // Adding/editing panels never saves. This is the single creation request.
      await workoutPlanService.createWorkoutPlan(input);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Unable to create workout plan:', error);
      setError('Unable to create workout plan. Your draft is still here; please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <main className="min-h-screen bg-slate-50 p-8"><p>Loading exercises...</p></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <button type="button" disabled={isSubmitting} onClick={() => navigate('/')}
          className="mb-6 text-sm font-semibold text-emerald-700">
          Back to home
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Create workout plan</h1>
          <p className="mt-2 text-slate-600">Add days and exercises, then save your complete plan.</p>
          {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {exercises.length === 0 && <p className="mt-5 text-slate-600">No exercises are available. A plan cannot be saved until exercises are available.</p>}

          {/* One form submits everything. Add buttons use type="button"
              so they change draft state without submitting the form. */}
          <form onSubmit={handleSubmit} className="mt-6">
            <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
              <legend className="sr-only">Workout plan details</legend>
              <div>
                <label htmlFor="plan-name" className={labelClass}>Plan name</label>
                <input required id="plan-name" value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                  className={inputClass} placeholder="Strength Plan" />
              </div>
              {days.length === 0 && <p className="text-slate-600">Add your first workout day to get started.</p>}

              {/* Stable keys track panels independently, even when entries
                  reference the same library exercise. */}
              {days.map((day, dayIndex) => (
                <fieldset key={day.draftId} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
                  <legend className="px-2 font-bold text-slate-900">Day {dayIndex + 1}</legend>
                  <button type="button" onClick={() => removeDay(day.draftId)}
                    aria-label={`Remove day ${dayIndex + 1}`} className={removeButtonClass}>
                    Remove day
                  </button>
                  <div>
                    <label htmlFor={`day-${day.draftId}`} className={labelClass}>Day name</label>
                    <input required id={`day-${day.draftId}`} value={day.name}
                      onChange={(event) => updateDayName(day.draftId, event.target.value)}
                      className={inputClass} placeholder="Push Day" />
                  </div>
                  {day.exercises.length === 0 && <p className="text-sm text-slate-600">Add at least one exercise to this day before saving.</p>}
                  {day.exercises.map((entry, entryIndex) => (
                    <fieldset key={entry.entryId} className="min-w-0 space-y-4 rounded-xl bg-slate-50 p-4">
                      <legend className="text-sm font-semibold text-slate-700">Exercise {entryIndex + 1}</legend>
                      <button type="button" onClick={() => removeExercise(day.draftId, entry.entryId)}
                        aria-label={`Remove exercise ${entryIndex + 1} from day ${dayIndex + 1}`} className={removeButtonClass}>
                        Remove exercise
                      </button>
                      <div>
                        <label htmlFor={`exercise-${entry.entryId}`} className={labelClass}>Exercise</label>
                        <select required id={`exercise-${entry.entryId}`} value={entry.exerciseId}
                          onChange={(event) => updateExercise(day.draftId, entry.entryId, 'exerciseId', event.target.value)}
                          className={inputClass}>
                          <option value="">Select an exercise</option>
                          {exercises.map((exercise) => (
                            <option key={exercise._id} value={exercise._id}>{exercise.name} — {exercise.muscleGroup}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label htmlFor={`sets-${entry.entryId}`} className={labelClass}>Target sets</label>
                          {/* Controlled inputs display state with value and
                              update it through onChange. */}
                          <input required id={`sets-${entry.entryId}`} type="number" min={1} step={1}
                            value={entry.targetSets}
                            onChange={(event) => updateExercise(day.draftId, entry.entryId, 'targetSets', event.target.value)}
                            className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor={`reps-${entry.entryId}`} className={labelClass}>Target reps</label>
                          <input required id={`reps-${entry.entryId}`} type="number" min={1} step={1}
                            value={entry.targetReps}
                            onChange={(event) => updateExercise(day.draftId, entry.entryId, 'targetReps', event.target.value)}
                            className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor={`weight-${entry.entryId}`} className={labelClass}>Target weight (lb, optional)</label>
                          <input id={`weight-${entry.entryId}`} type="number" min={0} step="any"
                            value={entry.targetWeight}
                            onChange={(event) => updateExercise(day.draftId, entry.entryId, 'targetWeight', event.target.value)}
                            className={inputClass} placeholder="Not specified" />
                        </div>
                      </div>
                    </fieldset>
                  ))}
                  <button type="button" onClick={() => addExercise(day.draftId)} className={addButtonClass}>Add exercise</button>
                </fieldset>
              ))}
              <button type="button" onClick={addDay} className={addButtonClass}>Add day</button>
              <button type="submit" disabled={isSubmitting || exercises.length === 0}
                className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? 'Saving...' : 'Save plan'}
              </button>
            </fieldset>
          </form>
        </div>
        1
        
      </div>
    </main>
  );
}

export default CreateWorkoutPlanPage;
