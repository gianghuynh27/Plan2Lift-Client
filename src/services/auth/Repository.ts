import baseApi from "../Api";

import type { Payloads, Responses } from "./Types";

export const registerUser = async (
  payload: Payloads["registerUser"],
): Promise<Responses["registerUser"]> => {
  try {
    const response = await baseApi.post("/v1/auth/register", payload);
    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    return response.data as Responses["registerUser"];
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// : Promise<
//   Responses["getCurrentUser"] | null
// >
export const getCurrentUser = async () => {
  try {
    const response = await baseApi.get("/v1/users/me");
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response.data.data as Responses["getCurrentUser"];
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const loginUser = async (
  payload: Payloads["loginUser"],
): Promise<Responses["loginUser"] | null> => {
  try {
    const response = await baseApi.post("/v1/auth/login", payload);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response.data as Responses["loginUser"];
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
};

type DuplicateCheckType = "email" | "username";

export const isDuplicate = async (
  type: DuplicateCheckType,
  value: string,
): Promise<Responses["isDuplicate"] | null | { isDuplicate: boolean }> => {
  try {
    const response = await baseApi.get(
      `/v1/auth/duplicate/${type}?value=${value}`,
    );
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response.data as Responses["isDuplicate"];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error checking duplicate ${type}:`, error.message);
      if (error.message.includes("409")) {
        return { isDuplicate: true };
      }
    }

    console.error(`Error checking duplicate ${type}:`, error);
    return null;
  }
};

export const resendVerificationEmail = async (
  payload: Payloads["resendVerificationEmail"],
): Promise<Responses["resendVerificationEmail"]> => {
  const response = await baseApi.post("/v1/auth/resend-verification", payload);

  return response.data as Responses["resendVerificationEmail"];
};

export const verifyEmail = async (
  token: string,
): Promise<Responses["verifyEmail"]> => {
  const response = await baseApi.post("/v1/auth/verify-email", {
    token,
  });
  return response.data as Responses["verifyEmail"];
};
