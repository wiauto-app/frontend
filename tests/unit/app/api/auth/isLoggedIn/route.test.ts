import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/config/cookies.config", () => ({
  cookiesConfig: {
    accessToken: { name: "access_token" },
    refreshToken: { name: "refresh_token" },
  },
}));

import { cookies } from "next/headers";
import { GET } from "@/app/api/auth/isLoggedIn/route";

describe("GET /api/auth/isLoggedIn", () => {
  const mockCookiesGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({
      get: mockCookiesGet,
    } as Awaited<ReturnType<typeof cookies>>);
  });

  it("retorna isLoggedIn true cuando solo existe refresh_token", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "refresh_token") {
        return { value: "refresh-value" };
      }
      return undefined;
    });

    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ isLoggedIn: true });
  });

  it("retorna isLoggedIn false cuando no hay refresh_token", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "access_token") {
        return { value: "access-value" };
      }
      return undefined;
    });

    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ isLoggedIn: false });
  });

  it("retorna isLoggedIn true cuando existen ambos tokens", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "access_token") {
        return { value: "access-value" };
      }
      if (name === "refresh_token") {
        return { value: "refresh-value" };
      }
      return undefined;
    });

    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ isLoggedIn: true });
  });
});
