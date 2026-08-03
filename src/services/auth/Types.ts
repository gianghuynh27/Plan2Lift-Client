// import type { AuthUser } from "../../api/auth.api";

export type Payloads = {
  registerUser: {
    username: string;
    email: string;
    password: string;
  };
  loginUser: {
    email: string;
    password: string;
  };
};

type AuthResponse = {
  message: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type Responses = {
  registerUser: AuthResponse;
  getCurrentUser: {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  loginUser: AuthResponse;
};
