import baseApi from '../Api';

import type {
  ExerciseFilters,
  ExerciseListResponse,
  ExerciseResponse,
} from './Types';

export async function getExercises(
  filters: ExerciseFilters = {},
): Promise<ExerciseListResponse> {
  const response =
    await baseApi.get<ExerciseListResponse>(
      '/v1/exercises',
      {
        params: filters,
      },
    );

  return response.data;
}

export async function getExerciseById(
  exerciseId: string,
): Promise<ExerciseResponse> {
  const response =
    await baseApi.get<ExerciseResponse>(
      `/v1/exercises/${exerciseId}`,
    );

  return response.data;
}