export type PlannedExerciseInput = {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
};

export type WorkoutDayInput = {
  name: string;
  exercises: PlannedExerciseInput[];
};

export type CreateWorkoutPlanInput = {
  name: string;
  description?: string;
  days: WorkoutDayInput[];
  isActive?: boolean;
};

export type ExerciseSummary = {
  _id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
};

export type PlannedExercise<
  TExercise = ExerciseSummary | null,
> = {
  _id: string;
  exerciseId: TExercise;
  targetSets: number;
  targetReps: number;
};

export type WorkoutDay<
  TExercise = ExerciseSummary | null,
> = {
  _id: string;
  name: string;
  exercises: PlannedExercise<TExercise>[];
};

export type WorkoutPlan<
  TExercise = ExerciseSummary | null,
> = {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  days: WorkoutDay<TExercise>[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type WorkoutPlanResponse = {
  message: string;
  data: WorkoutPlan;
};

export type CreateWorkoutPlanResponse = {
  message: string;
  data: WorkoutPlan<string>;
};

export type WorkoutPlanListResponse = {
  message: string;
  data: WorkoutPlan[];
  total: number;
};