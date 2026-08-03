import { createContext } from "react";
import type { AuthUser } from "../../api/auth.api";

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  login: (email: string, password: string) => Promise<void>;

  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default AuthContext;
