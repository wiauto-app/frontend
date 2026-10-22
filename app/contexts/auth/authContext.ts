import { MeResponseDto } from "@/services/authService";
import { createContext } from "react";

export type AuthContextValue = {
  user?: MeResponseDto;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** `true` tras la primera comprobación de sesión (con o sin usuario). */
  isAuthResolved: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);