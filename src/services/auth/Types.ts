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
  resendVerificationEmail: {
    email: string;
  };
};

type RegisterResponse = {
  message: string;
  emailSent: boolean;
};

type LoginResponse = {
  message: string;
  tokens: {
    accessToken: string;
  };
};

export type Responses = {
  registerUser: RegisterResponse;
  getCurrentUser: {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  loginUser: LoginResponse;
  isDuplicate: {
    isDuplicate: boolean;
    message: string;
  };
  resendVerificationEmail: {
    message: string;
  };
  verifyEmail: {
    message: string;
  };
};
