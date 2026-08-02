import { useEffect, useState, type ReactNode } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  type AuthUser,
} from "../api/auth.api";
import { AuthContext } from "./auth-context";

const ACCESS_TOKEN_KEY = "accessToken";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [initialToken] = useState(() =>
    sessionStorage.getItem(ACCESS_TOKEN_KEY),
  );

  const [accessToken, setAccessToken] = useState<string | null>(initialToken);

  const [user, setUser] = useState<AuthUser | null>(null);

  const [isInitializing, setIsInitializing] = useState(Boolean(initialToken));

  useEffect(() => {
    if (!initialToken) {
      return;
    }

    let isActive = true;

    getCurrentUser(initialToken)
      .then((response) => {
        if (isActive) {
          setUser(response.data);
        }
      })
      .catch(() => {
        if (isActive) {
          sessionStorage.removeItem(ACCESS_TOKEN_KEY);
          setAccessToken(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsInitializing(false);
        }
      });
    return () => {
      isActive = false;
    };
  }, [initialToken]);

  async function establishSession(token: string) {
    const response = await getCurrentUser(token);

    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);

    setAccessToken(token);
    setUser(response.data);
  }

  async function login(email: string, password: string) {
    const response = await loginUser({ email, password });

    await establishSession(response.tokens.accessToken);
  }

  async function register(username: string, email: string, password: string) {
    const response = await registerUser({ username, email, password });

    await establishSession(response.tokens.accessToken);
  }

  async function logout() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
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
