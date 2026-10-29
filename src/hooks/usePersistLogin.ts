import { useEffect } from "react";
import type { Responses } from "../services/auth/Types";
import {
  getAccessToken,
  removeAccessToken,
  storeAccessToken,
} from "../services/Api";

type AuthUser = Responses["getCurrentUser"];

type RefreshAccessToken = () => Promise<string>;

type GetCurrentUser = () => Promise<AuthUser>;

export default function usePersistLogin(
  initialToken: string | null,
  refreshAccessToken: RefreshAccessToken,

  getCurrentUser: GetCurrentUser,
  setUser: (user: AuthUser | null) => void,
  setAccessToken: (token: string | null) => void,
  setIsInitializing: (isInitializing: boolean) => void,
) {
  useEffect(() => {
    let isActive = true;

    async function initializeSession() {
      try {
        let accessToken = initialToken;
        /*
         * A new browser tab has its own empty
         * sessionStorage. Use the shared HttpOnly
         * refresh cookie to obtain an access token.
         */
        if (!accessToken) {
          accessToken = await refreshAccessToken();
        }

        if (!isActive) {
          return;
        }

        storeAccessToken(accessToken);
        setAccessToken(accessToken);
        const currentUser = await getCurrentUser();
        if (!isActive) {
          return;
        }
        /*
         * The interceptor may have replaced an
         * expired token while loading the user.
         */
        const latestAccessToken = getAccessToken();

        setAccessToken(latestAccessToken ?? accessToken);

        setUser(currentUser);
      } catch {
        if (!isActive) {
          return;
        }

        removeAccessToken();

        setAccessToken(null);
        setUser(null);
      } finally {
        if (isActive) {
          setIsInitializing(false);
        }
      }
    }
    void initializeSession();
    return () => {
      isActive = false;
    };
  }, [
    initialToken,
    refreshAccessToken,
    getCurrentUser,
    setUser,
    setAccessToken,
    setIsInitializing,
  ]);
}
