import type { NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import { API_URL } from "@/constants";
import { refreshTokenService } from "@/app/(auth)/services/refreshTokenService";
import type { ApiResponse } from "@/lib/api";
import type { User } from "@/interfaces/user.interface";
import type { AuthResponseDto } from "@/validations/auth";
import { MeResponseDto } from "@/services/authService";

export type EnsureSessionResult =
  | { outcome: "session_valid" }
  | {
      outcome: "session_refreshed";
      access_token: string;
      refresh_token_hash: string;
    }
  | { outcome: "unauthorized" }
  | { outcome: "me_not_ok"; status: number };

const get_refresh_cookie_value = (
  data: Pick<AuthResponseDto, "token"> & {
    refresh_token?: string;
    refreshToken_hash?: string;
  },
): string | null => {
  if (typeof data.refresh_token === "string") {
    return data.refresh_token;
  }
  if (typeof data.refreshToken_hash === "string") {
    return data.refreshToken_hash;
  }
  return null;
};

const is_session_payload = (
  data: unknown,
): data is Pick<AuthResponseDto, "token"> & {
  refresh_token?: string;
  refreshToken_hash?: string;
} => {
  if (typeof data !== "object" || data === null) return false;
  const record = data as Record<string, unknown>;
  return (
    typeof record.token === "string" &&
    (typeof record.refresh_token === "string" ||
      typeof record.refreshToken_hash === "string")
  );
};

const buildApiUrl = (path: string): string => {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) {
    return normalizedPath;
  }
  return `${base}${normalizedPath}`;
};

export const getServerSession = async (params: {
  cookie_header: string;
  access_token?: string | null;
}): Promise<ApiResponse<MeResponseDto | null>> => {
  const { cookie_header, access_token } = params;

  if (!access_token) {
    return {
      ok: false,
      message: "No access token",
      status: 401,
      data: null,
    };
  }

  const meResponse = await fetch(buildApiUrl("/auth/me"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      ...(cookie_header ? { Cookie: cookie_header } : {}),
    },
  });

  const body = (await meResponse.json()) as ApiResponse<MeResponseDto | null>;

  return {
    ok: body.ok ?? meResponse.ok,
    message: body.message ?? meResponse.statusText,
    status: body.status ?? meResponse.status,
    data: body.data,
  };
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
  const me = await getServerSession({ cookie_header, access_token });
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

  const refresh_cookie_value = get_refresh_cookie_value(refreshed.data);
  if (!refresh_cookie_value) {
    return { outcome: "unauthorized" };
  }

  return {
    outcome: "session_refreshed",
    access_token: refreshed.data.token,
    refresh_token_hash: refresh_cookie_value,
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
    options?: (typeof cookiesConfig)["accessToken"]["options"] | (typeof cookiesConfig)["refreshToken"]["options"],
  ) => void;
  delete: (name: string) => void;
};

/** Middleware / Route Handlers: escribe tokens en la NextResponse. */
export const withSessionCookies = (
  response: NextResponse,
  access_token: string,
  refresh_token_hash: string,
): NextResponse => {
  response.cookies.set(cookiesConfig.accessToken.name, access_token, cookiesConfig.accessToken.options);
  response.cookies.set(
    cookiesConfig.refreshToken.name,
    refresh_token_hash,
    cookiesConfig.refreshToken.options,
  );
  return response;
};

/** Middleware: elimina cookies de sesión en la NextResponse (p. ej. redirect a login). */
export const clearSessionCookiesOnResponse = (response: NextResponse): NextResponse => {
  response.cookies.delete(cookiesConfig.accessToken.name);
  response.cookies.delete(cookiesConfig.refreshToken.name);
  return response;
};

/** Server Actions: escribe tokens usando el store devuelto por `cookies()`. */
export const writeSessionTokensToCookieStore = (
  store: MutableCookieStore,
  access_token: string,
  refresh_token_hash: string,
): void => {
  store.set(cookiesConfig.accessToken.name, access_token, cookiesConfig.accessToken.options);
  store.set(
    cookiesConfig.refreshToken.name,
    refresh_token_hash,
    cookiesConfig.refreshToken.options,
  );
};

export const clearSessionFromCookieStore = (store: MutableCookieStore): void => {
  store.delete(cookiesConfig.accessToken.name);
  store.delete(cookiesConfig.refreshToken.name);
};
