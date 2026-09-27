export type ExerciseDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

export type ExerciseCategory =
  | "balance"
  | "cardio"
  | "mobility"
  | "plyometrics"
  | "rehabilitation"
  | "strength"
  | "stretching";

export type Exercise = {
  _id: string;
  name: string;
  muscleGroup: string;
  bodyPart?: string;
  equipment?: string;
  difficulty?: ExerciseDifficulty;
  category?: ExerciseCategory;
};

export type ExerciseDetails = Exercise & {
  secondaryMuscles: string[];
  instructions: string[];
  description?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExerciseFilters = {
  search?: string;
  muscleGroup?: string;
};

export type ExerciseListResponse = {
  message: string;
  data: Exercise[];
  total: number;
};

export type ExerciseResponse = {
  message: string;
  data: ExerciseDetails;
};