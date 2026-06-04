import { AUTH_ROUTES } from "@/constants/auth.constants";

const PUBLIC_AUTH_PATH_PREFIXES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  "/olvide-contrasena",
  "/cambiar-contrasena",
  "/confirmar-correo",
  "/api/auth",
] as const;

export const isPublicAuthRoute = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const pathname = window.location.pathname;

  return PUBLIC_AUTH_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};
