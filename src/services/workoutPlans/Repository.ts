import baseApi from '../Api';

import type {
  CreateWorkoutPlanInput,
  WorkoutPlanResponse,
} from './Types';

export async function createWorkoutPlan(
  input: CreateWorkoutPlanInput,
): Promise<WorkoutPlanResponse> {
  const response =
    await baseApi.post<WorkoutPlanResponse>(
      '/v1/workout-plans',
      input,
    );

  return response.data;
}