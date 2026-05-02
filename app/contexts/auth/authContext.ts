import { User } from "@/interfaces/user.interface";
import { createContext } from "react";

export type AuthContextValue = {
  user: User | null;
  /** Primera carga: resolución de sesión con getMe. */
  isLoading: boolean;
  /** Refresco en segundo plano (p. ej. tras actualizar perfil). */
  isRefreshing: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);