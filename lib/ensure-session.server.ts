import type { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { cookiesConfig } from "@/config/cookies.config";
import { API_URL } from "@/constants";
import { refreshTokenService } from "@/app/(auth)/services/refreshTokenService";
import type { ApiResponse } from "@/lib/api";
import type { AuthResponseDto } from "@/validations/auth";
import { MeResponseDto } from "@/services/authService";
export type EnsureSessionResult =
  | { outcome: "session_valid" }
  | {
    outcome: "session_refreshed";
    access_token: string;
    refresh_token?: string;
  }
  | { outcome: "two_factor_pending" }
  | { outcome: "unauthorized" }
  | { outcome: "refresh_unavailable"; status: number }
  | { outcome: "me_not_ok"; status: number };

/** Resultado listo para Route Handler / Server Action al renovar sesión desde cookies. */
export interface ResolveSessionRefreshResult {
  status: number;
  refreshed: boolean;
  clearCookies: boolean;
  tokens?: {
    access_token: string;
    refresh_token_hash: string;
  };
}

const TWO_FA_REQUIRED_MESSAGE = "Debes completar la verificación en dos pasos";

const decodeJwtScope = (access_token: string | null): string | null => {
  if (!access_token) return null;

  try {
    const payloadBase64 = access_token.split(".")[1];
    if (!payloadBase64) return null;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8"),
    ) as { scope?: string };

    return typeof payload.scope === "string" ? payload.scope : null;
  } catch {
    return null;
  }
};

const isTwoFactorPendingResponse = (
  me: ApiResponse<MeResponseDto | null>,
): boolean =>
  me.status === 401 && me.message === TWO_FA_REQUIRED_MESSAGE;

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

export interface SessionTokens {
  access_token: string | null;
  refresh_token: string | null;
}

export const readSessionTokensFromCookies = async (): Promise<SessionTokens> => {
  const cookieStore = await cookies();

  return {
    access_token: cookieStore.get(cookiesConfig.accessToken.name)?.value ?? null,
    refresh_token: cookieStore.get(cookiesConfig.refreshToken.name)?.value ?? null,
  };
};

export const getServerSession = async (params?: {
  refresh_token?: string | null;
  access_token?: string | null;
}): Promise<ApiResponse<MeResponseDto | null>> => {

  let access_token = null as string | null;
  let refresh_token = null as string | null;
  if (!params?.access_token && !params?.refresh_token) {
    const cookiesStore = await cookies();
    access_token = cookiesStore.get(cookiesConfig.accessToken.name)?.value ?? null;
    refresh_token = cookiesStore.get(cookiesConfig.refreshToken.name)?.value ?? null;
    if (!access_token && !refresh_token) {
      return {
        ok: false,
        message: "No access token",
        status: 401,
        data: null,
      };
    }
  }

  const meResponse = await fetch(buildApiUrl("/auth/me"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      ...(refresh_token ? { Cookie: `refresh_token=${refresh_token}` } : {}),
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



export const getServerSessionOrNull = async (): Promise<MeResponseDto | null> => {
  const session = await getServerSession();
  return session.ok ? session.data : null;
};

/**
 * Comprueba /auth/me y, solo ante 401, intenta POST /auth/refresh con el header Cookie.
 * Sin efectos secundarios: no escribe cookies; el llamador aplica el resultado en Response o cookies().
 */
export const ensureValidSession = async (params: {
  refresh_token: string;
  access_token: string | null;
}): Promise<EnsureSessionResult> => {
  const { refresh_token, access_token } = params;

  if (decodeJwtScope(access_token) === "2fa_challenge") {
    return { outcome: "two_factor_pending" };
  }

  const me = await getServerSession({ refresh_token, access_token });
  if (me.ok) {
    return { outcome: "session_valid" };
  }

  if (isTwoFactorPendingResponse(me)) {
    return { outcome: "two_factor_pending" };
  }

  if (me.status !== 401) {
    return { outcome: "me_not_ok", status: me.status };
  }

  const refreshed = await refreshTokenService.refreshToken(refresh_token);
  if (!refreshed.ok || !is_session_payload(refreshed.data)) {
    if (refreshed.status === 401) {
      return { outcome: "unauthorized" };
    }

    return {
      outcome: "refresh_unavailable",
      status: refreshed.status || 503,
    };
  }


  return {
    outcome: "session_refreshed",
    access_token: refreshed.data.token,
    refresh_token: refreshed.data.refresh_token,
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
export const setSessionCookies = async (
  access_token: string,
  refresh_token_hash: string,
): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(cookiesConfig.accessToken.name, access_token, cookiesConfig.accessToken.options);
  cookieStore.set(
    cookiesConfig.refreshToken.name,
    refresh_token_hash,
    cookiesConfig.refreshToken.options,
  );
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
