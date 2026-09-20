import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import { FRONTEND_URL } from "@/constants";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";

export interface AuthSessionCallbackParams {
  token: string | null;
  refreshToken: string | null;
  type: string | null;
  message: string | null;
  next?: string | null;
}

export interface AuthSessionCallbackOptions {
  /**
   * Tras sesión válida (sin 2FA), redirige siempre a `/?verified=1`.
   * Usado por el deep link de verificación de correo.
   */
  forceVerifiedHome?: boolean;
  /** Mensaje por defecto en `/iniciar-sesion?error=` si faltan tokens. */
  defaultErrorMessage?: string;
}

const resolvePostLoginPath = (
  redirectUrl: string | undefined,
  next: string | null,
): string => {
  if (redirectUrl && isValidReturnPath(redirectUrl)) {
    return redirectUrl;
  }

  if (next && isValidReturnPath(next)) {
    return next;
  }

  return "/";
};

export const setAuthSessionCookies = async (
  token: string,
  refreshToken: string,
): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(
    cookiesConfig.accessToken.name,
    token,
    cookiesConfig.accessToken.options,
  );
  cookieStore.set(
    cookiesConfig.refreshToken.name,
    refreshToken,
    cookiesConfig.refreshToken.options,
  );
  cookieStore.delete({
    name: cookiesConfig.redirectUrl.name,
    path: cookiesConfig.redirectUrl.options.path,
    domain: cookiesConfig.redirectUrl.options.domain,
  });
};

export const handleAuthSessionCallback = async (
  params: AuthSessionCallbackParams,
  options: AuthSessionCallbackOptions = {},
): Promise<NextResponse> => {
  const { token, refreshToken, type, message, next = null } = params;
  const {
    forceVerifiedHome = false,
    defaultErrorMessage = "No se pudo iniciar sesión",
  } = options;

  if (!token || !refreshToken || !type) {
    const loginError = new URL("/iniciar-sesion", FRONTEND_URL);
    loginError.searchParams.set("error", message ?? defaultErrorMessage);
    return NextResponse.redirect(loginError);
  }

  const cookieStore = await cookies();
  const redirectUrl = cookieStore.get(cookiesConfig.redirectUrl.name)?.value;

  await setAuthSessionCookies(token, refreshToken);

  if (type === "2fa_challenge") {
    return NextResponse.redirect(new URL("/verificacion-2fa", FRONTEND_URL));
  }

  if (forceVerifiedHome || message) {
    return NextResponse.redirect(new URL("/?verified=1", FRONTEND_URL));
  }

  const redirectPath = resolvePostLoginPath(redirectUrl, next);
  return NextResponse.redirect(new URL(redirectPath, FRONTEND_URL));
};
