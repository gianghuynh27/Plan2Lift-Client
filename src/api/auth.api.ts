export type AuthUser = {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  verified?: boolean;
};

type TokenResponse = {
  message: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

type CurrentUserResponse = {
  message: string;
  data: AuthUser;
};

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "Something went wrong";

    throw new Error(message);
  }

  return body as T;
}

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return readResponse<TokenResponse>(response);
}

export async function loginUser(input: { email: string; password: string }) {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readResponse<TokenResponse>(response);
}

export async function getCurrentUser(accessToken: string) {
  const response = await fetch("/api/v1/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return readResponse<CurrentUserResponse>(response);
}
