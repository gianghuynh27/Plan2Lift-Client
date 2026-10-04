import baseApi from "../Api";

import type {
  CreateWorkoutPlanInput,
  CreateWorkoutPlanResponse,
  WorkoutPlanListResponse,
  WorkoutPlanResponse,
} from "./Types";

export async function createWorkoutPlan(
  input: CreateWorkoutPlanInput,
): Promise<CreateWorkoutPlanResponse> {
  const response = await baseApi.post<CreateWorkoutPlanResponse>(
    "/v1/workout-plans",
    input,
  );

  return response.data;
}

export async function getWorkoutPlans(): Promise<WorkoutPlanListResponse> {
  const response =
    await baseApi.get<WorkoutPlanListResponse>("/v1/workout-plans");

  return response.data;
}

export async function getWorkoutPlanById(
  workoutPlanId: string,
): Promise<WorkoutPlanResponse> {
  const response = await baseApi.get<WorkoutPlanResponse>(
    `/v1/workout-plans/${workoutPlanId}`,
  );

  return response.data;
}
