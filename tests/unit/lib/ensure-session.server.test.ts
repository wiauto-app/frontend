import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/(auth)/services/refreshTokenService", () => ({
  refreshTokenService: {
    refreshToken: vi.fn(),
  },
}));

vi.mock("@/constants", () => ({
  API_URL: "http://localhost:3001/api",
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";
import {
  ensureValidSession,
  getServerSession,
  getServerSessionOrNull,
  getServerSessionWithTokens,
  readSessionTokensFromCookies,
} from "@/lib/ensure-session.server";
import { refreshTokenService } from "@/app/(auth)/services/refreshTokenService";

const buildJwtWithScope = (scope: string): string => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url",
  );
  const payload = Buffer.from(JSON.stringify({ scope })).toString("base64url");
  return `${header}.${payload}.signature`;
};

const mockCookieStore = (values: Record<string, string | undefined>) => ({
  get: (name: string) => {
    const value = values[name];
    return value !== undefined ? { name, value } : undefined;
  },
});

describe("readSessionTokensFromCookies", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("lee access_token y refresh_token desde cookies()", async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore({
        access_token: "access-123",
        refresh_token: "refresh-456",
      }) as Awaited<ReturnType<typeof cookies>>,
    );

    await expect(readSessionTokensFromCookies()).resolves.toEqual({
      access_token: "access-123",
      refresh_token: "refresh-456",
    });
  });

  it("devuelve null cuando faltan cookies de sesión", async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore({}) as Awaited<ReturnType<typeof cookies>>,
    );

    await expect(readSessionTokensFromCookies()).resolves.toEqual({
      access_token: null,
      refresh_token: null,
    });
  });
});

describe("getServerSessionWithTokens", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("retorna 401 sin access_token", async () => {
    const result = await getServerSessionWithTokens({
      access_token: null,
      refresh_token: "refresh-456",
    });

    expect(result).toEqual({
      ok: false,
      message: "No access token",
      status: 401,
      data: null,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("consulta /auth/me con Authorization y Cookie de refresh", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        ok: true,
        message: "OK",
        status: 200,
        data: { id: "user-1", email: "user@example.com" },
      }),
    } as Response);

    const result = await getServerSessionWithTokens({
      access_token: "access-123",
      refresh_token: "refresh-456",
    });

    expect(fetch).toHaveBeenCalledWith("http://localhost:3001/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer access-123",
        Cookie: "refresh_token=refresh-456",
      },
    });
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ id: "user-1", email: "user@example.com" });
  });
});

describe("getServerSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("combina cookies() con la consulta a /auth/me", async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore({
        access_token: "access-123",
        refresh_token: "refresh-456",
      }) as Awaited<ReturnType<typeof cookies>>,
    );

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        ok: true,
        message: "OK",
        status: 200,
        data: { id: "user-1" },
      }),
    } as Response);

    const result = await getServerSession();

    expect(cookies).toHaveBeenCalled();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ id: "user-1" });
  });
});

describe("getServerSessionOrNull", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("devuelve data cuando la sesión es válida", async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore({
        access_token: "access-123",
      }) as Awaited<ReturnType<typeof cookies>>,
    );

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        ok: true,
        message: "OK",
        status: 200,
        data: { id: "user-1", name: "Ana" },
      }),
    } as Response);

    await expect(getServerSessionOrNull()).resolves.toEqual({
      id: "user-1",
      name: "Ana",
    });
  });

  it("devuelve null cuando la sesión no es válida", async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore({}) as Awaited<ReturnType<typeof cookies>>,
    );

    await expect(getServerSessionOrNull()).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("ensureValidSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("retorna two_factor_pending cuando JWT scope es 2fa_challenge sin llamar /auth/me", async () => {
    const result = await ensureValidSession({
      refresh_token: "rt-hash",
      access_token: buildJwtWithScope("2fa_challenge"),
    });

    expect(result).toEqual({ outcome: "two_factor_pending" });
    expect(fetch).not.toHaveBeenCalled();
    expect(refreshTokenService.refreshToken).not.toHaveBeenCalled();
  });

  it("retorna two_factor_pending cuando /auth/me responde 401 con mensaje 2FA", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({
        ok: false,
        message: "Debes completar la verificación en dos pasos",
        status: 401,
        data: null,
      }),
    } as Response);

    const result = await ensureValidSession({
      refresh_token: "rt-hash",
      access_token: buildJwtWithScope("session"),
    });

    expect(result).toEqual({ outcome: "two_factor_pending" });
    expect(refreshTokenService.refreshToken).not.toHaveBeenCalled();
  });
});
