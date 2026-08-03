import { useEffect } from "react";
import { SESSION_STORAGE } from "../constants";

import type { AuthUser } from "../api/auth.api";

export default function usePersistLogin(
  initialToken: string | null,
  getCurrentUser: (token: string) => Promise<AuthUser>,
  setUser: (user: AuthUser | null) => void,
  setAccessToken: (token: string | null) => void,
  setIsInitializing: (isInitializing: boolean) => void,
) {
  return useEffect(() => {
    if (!initialToken) {
      return;
    }

    let isActive = true;

    const checkIsLoggedIn = async () => {
      try {
        const currentUser = await getCurrentUser(initialToken);
        if (isActive) setUser(currentUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
        if (isActive) {
          sessionStorage.removeItem(SESSION_STORAGE.ACCESS_TOKEN_KEY);
          setAccessToken(null);
        }
      } finally {
        if (isActive) setIsInitializing(false);
      }
    };

    checkIsLoggedIn();
    return () => {
      isActive = false;
    };
  }, [
    initialToken,
    getCurrentUser,
    setUser,
    setAccessToken,
    setIsInitializing,
  ]);
}
