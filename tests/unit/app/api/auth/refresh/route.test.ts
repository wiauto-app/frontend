import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/config/cookies.config", () => ({
  cookiesConfig: {
    accessToken: {
      name: "access_token",
      options: { path: "/", httpOnly: true },
    },
    refreshToken: {
      name: "refresh_token",
      options: { path: "/", httpOnly: true },
    },
  },
}));

vi.mock("@/lib/ensure-session.server", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/ensure-session.server")
  >("@/lib/ensure-session.server");

  return {
    ...actual,
    resolveSessionRefresh: vi.fn(),
  };
});

import { cookies } from "next/headers";
import { POST } from "@/app/api/auth/refresh/route";
import { resolveSessionRefresh } from "@/lib/ensure-session.server";

describe("POST /api/auth/refresh", () => {
  const mockCookiesGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({
      get: mockCookiesGet,
    } as Awaited<ReturnType<typeof cookies>>);
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "access_token") {
        return { value: "access-value" };
      }
      if (name === "refresh_token") {
        return { value: "refresh-value" };
      }
      return undefined;
    });
  });

  it("responde 200 y Set-Cookie cuando la sesión se refresca", async () => {
    vi.mocked(resolveSessionRefresh).mockResolvedValueOnce({
      status: 200,
      refreshed: true,
      clearCookies: false,
      tokens: {
        access_token: "new-access",
        refresh_token_hash: "new-refresh",
      },
    });

    const response = await POST();
    const body = await response.json();

    expect(body).toEqual({ ok: true, refreshed: true });
    expect(response.status).toBe(200);
    expect(response.cookies.get("access_token")?.value).toBe("new-access");
    expect(response.cookies.get("refresh_token")?.value).toBe("new-refresh");
  });

  it("responde 401 y limpia cookies cuando el refresh es inválido", async () => {
    vi.mocked(resolveSessionRefresh).mockResolvedValueOnce({
      status: 401,
      refreshed: false,
      clearCookies: true,
    });

    const response = await POST();
    const body = await response.json();

    expect(body).toEqual({ ok: false, refreshed: false });
    expect(response.status).toBe(401);
  });

  it("responde 503 sin borrar cookies ante error temporal", async () => {
    vi.mocked(resolveSessionRefresh).mockResolvedValueOnce({
      status: 503,
      refreshed: false,
      clearCookies: false,
    });

    const response = await POST();
    const body = await response.json();

    expect(body).toEqual({ ok: false, refreshed: false });
    expect(response.status).toBe(503);
    expect(response.cookies.get("access_token")).toBeUndefined();
    expect(response.cookies.get("refresh_token")).toBeUndefined();
  });
});
