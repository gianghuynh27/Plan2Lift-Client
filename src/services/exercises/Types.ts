export type Exercise = {
  _id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
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
  data: Exercise;
};