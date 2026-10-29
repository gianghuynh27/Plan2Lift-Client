import { useState, type ReactNode } from "react";

import { authService } from "../../services/auth";
import AuthContext from "./AuthContext";

import { SESSION_STORAGE } from "../../constants";
import {
  getAccessToken,
  refreshAccessToken,
  removeAccessToken,
  storeAccessToken,
} from "../../services/Api";
import { usePersistLogin } from "../../hooks";
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

  /*
   * Always initialize.
   *
   * A new tab may not have an access token, but
   * it may still have a valid refresh-token cookie.
   */
  const [isInitializing, setIsInitializing] = useState(true);

  usePersistLogin(
    initialToken,
    refreshAccessToken,
    authService.getCurrentUser,
    setUser,
    setAccessToken,
    setIsInitializing,
  );

  async function establishSession(token: string): Promise<void> {
    storeAccessToken(token);
    setAccessToken(token);

    try {
      const currentUser = await authService.getCurrentUser();

      const latestAccessToken = getAccessToken();

      setAccessToken(latestAccessToken ?? token);

      setUser(currentUser);
    } catch (error) {
      removeAccessToken();

      setAccessToken(null);
      setUser(null);

      throw error;
    }
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
    const response = await authService.logoutUser();
    sessionStorage.removeItem(SESSION_STORAGE.ACCESS_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
    return response;
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
