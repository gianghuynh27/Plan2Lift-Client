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

export type WorkoutPlanResponse = {
  message: string;

  data: {
    _id: string;
    userId: string;
    name: string;
    description?: string;
    days: WorkoutDayInput[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};