import { useState, type ReactNode } from "react";


import { authService } from "../../services/auth";
import AuthContext from "./AuthContext";

import { SESSION_STORAGE } from "../../constants";
import { usePersistLogin } from "../../hooks";
import { toast } from "react-toastify";
import type { Responses } from "../../services/auth/Types";

type AuthProviderProps = {
  children: ReactNode;
};

type currentUser = Responses["getCurrentUser"];
export default function AuthProvider({ children }: AuthProviderProps) {
  const [initialToken] = useState(() =>
    sessionStorage.getItem(SESSION_STORAGE.ACCESS_TOKEN_KEY),
  );

  const [accessToken, setAccessToken] = useState<string | null>(initialToken);

  const [user, setUser] = useState<currentUser | null>(null);

  const [isInitializing, setIsInitializing] = useState(Boolean(initialToken));

  usePersistLogin(
    initialToken,
    authService.getCurrentUser as (token: string) => Promise<currentUser>,
    setUser,
    setAccessToken,
    setIsInitializing,
  );

  async function establishSession(token: string) {
    sessionStorage.setItem(SESSION_STORAGE.ACCESS_TOKEN_KEY, token);

    setAccessToken(token);
    // await sessionStorage.setItem(SESSION_STORAGE.ACCESS_TOKEN_KEY, token);
    const response = await authService.getCurrentUser();

    if (!response) {
      sessionStorage.removeItem(SESSION_STORAGE.ACCESS_TOKEN_KEY);

      setAccessToken(null);

      throw new Error("Unable to load your account after signing in.");
    }

    setUser(response as currentUser);
  }

  async function login(email: string, password: string) {
    const response = await authService.loginUser({ email, password });

    await establishSession(response.tokens.accessToken);
  }

  async function register(username: string, email: string, password: string) {
    const response = await authService.registerUser({
      username,
      email,
      password,
    });

    return response;
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
