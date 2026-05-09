import type { NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import { authService } from "@/services/authService";
import { refreshTokenService } from "@/app/(auth)/services/refreshTokenService";
import type { AuthResponseDto } from "@/validations/auth";

export type EnsureSessionResult =
  | { outcome: "session_valid" }
  | {
      outcome: "session_refreshed";
      access_token: string;
      refresh_token_hash: string;
    }
  | { outcome: "unauthorized" }
  | { outcome: "me_not_ok"; status: number };

const is_session_payload = (
  data: unknown,
): data is Pick<AuthResponseDto, "token" | "refreshToken_hash"> => {
  if (typeof data !== "object" || data === null) return false;
  const record = data as Record<string, unknown>;
  return (
    typeof record.token === "string" &&
    typeof record.refreshToken_hash === "string"
  );
};

/**
 * Comprueba /auth/me y, solo ante 401, intenta POST /auth/refresh con el header Cookie.
 * Sin efectos secundarios: no escribe cookies; el llamador aplica el resultado en Response o cookies().
 */
export const ensureValidSession = async (params: {
  cookie_header: string;
  access_token?: string | null;
}): Promise<EnsureSessionResult> => {
  const { cookie_header, access_token } = params;
  const me = await authService.getMe(access_token ?? undefined);

  if (me.ok) {
    return { outcome: "session_valid" };
  }

  if (me.status !== 401) {
    return { outcome: "me_not_ok", status: me.status };
  }

  const refreshed = await refreshTokenService.refreshToken(cookie_header);
  if (!refreshed.ok || !is_session_payload(refreshed.data)) {
    return { outcome: "unauthorized" };
  }

  return {
    outcome: "session_refreshed",
    access_token: refreshed.data.token,
    refresh_token_hash: refreshed.data.refreshToken_hash,
  };
};

/** Serializa cookies del request (middleware) o del store (server action) para el header Cookie. */
export const requestCookiesToHeader = (
  pairs: Iterable<{ name: string; value: string }>,
): string =>
  Array.from(pairs, (c) => `${c.name}=${c.value}`).join("; ");

/** Subconjunto de la API de `cookies()` para Server Actions sin acoplar este módulo a Edge/middleware. */
export type MutableCookieStore = {
  set: (
    name: string,
    value: string,
    options?: (typeof cookiesConfig)["options"],
  ) => void;
  delete: (name: string) => void;
};

/** Middleware / Route Handlers: escribe tokens en la NextResponse. */
export const withSessionCookies = (
  response: NextResponse,
  access_token: string,
  refresh_token_hash: string,
): NextResponse => {
  response.cookies.set(cookiesConfig.name, access_token, cookiesConfig.options);
  response.cookies.set(
    cookiesConfig.refreshTokenName,
    refresh_token_hash,
    cookiesConfig.options,
  );
  return response;
};

/** Middleware: elimina cookies de sesión en la NextResponse (p. ej. redirect a login). */
export const clearSessionCookiesOnResponse = (response: NextResponse): NextResponse => {
  response.cookies.delete(cookiesConfig.name);
  response.cookies.delete(cookiesConfig.refreshTokenName);
  return response;
};

/** Server Actions: escribe tokens usando el store devuelto por `cookies()`. */
export const writeSessionTokensToCookieStore = (
  store: MutableCookieStore,
  access_token: string,
  refresh_token_hash: string,
): void => {
  store.set(cookiesConfig.name, access_token, cookiesConfig.options);
  store.set(
    cookiesConfig.refreshTokenName,
    refresh_token_hash,
    cookiesConfig.options,
  );
};

export const clearSessionFromCookieStore = (store: MutableCookieStore): void => {
  store.delete(cookiesConfig.name);
  store.delete(cookiesConfig.refreshTokenName);
};
