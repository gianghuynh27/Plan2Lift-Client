import { useState, type ReactNode } from "react";

import {
  // getCurrentUser,
  // loginUser,
  // registerUser,
  type AuthUser,
} from "../../api/auth.api";

import { authService } from "../../services/auth";
import AuthContext from "./AuthContext";

import { SESSION_STORAGE } from "../../constants";
import { usePersistLogin } from "../../hooks";
import { toast } from "react-toastify";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [initialToken] = useState(() =>
    sessionStorage.getItem(SESSION_STORAGE.ACCESS_TOKEN_KEY),
  );

  const [accessToken, setAccessToken] = useState<string | null>(initialToken);

  const [user, setUser] = useState<AuthUser | null>(null);

  const [isInitializing, setIsInitializing] = useState(Boolean(initialToken));

  usePersistLogin(
    initialToken,
    authService.getCurrentUser as (token: string) => Promise<AuthUser>,
    setUser,
    setAccessToken,
    setIsInitializing,
  );

  async function establishSession(token: string) {
    new Promise<void>((resolve) => {
      setAccessToken(token);
      sessionStorage.setItem(SESSION_STORAGE.ACCESS_TOKEN_KEY, token);
      resolve();
    }).then(async () => {
      const response = await authService.getCurrentUser();
      setUser(response as AuthUser);
    });

    // await sessionStorage.setItem(SESSION_STORAGE.ACCESS_TOKEN_KEY, token);

    // const response = (await authService.getCurrentUser()) as AuthUser;
    // setAccessToken(token);
    // setUser(response);
  }

  async function login(email: string, password: string) {
    const response = await authService.loginUser({ email, password });
    if (!response) {
      console.error("Login failed");
      toast("Login failed. Please check your credentials and try again.", {
        type: "error",
      });
      return;
    }

    await establishSession(response?.tokens.accessToken);
  }

  async function register(username: string, email: string, password: string) {
    const response = await authService.registerUser({
      username,
      email,
      password,
    });

    if (!response) {
      console.error("Registration failed");
      return;
    }

    //await establishSession(response.tokens.accessToken);
  }

  async function logout() {
    sessionStorage.removeItem(SESSION_STORAGE.ACCESS_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(accessToken && user),
        isInitializing,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
