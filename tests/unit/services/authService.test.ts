import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  API_URL: "http://localhost:3001/api",
  FRONTEND_URL: "http://localhost:3000",
}));

const fetchWithAuthMock = vi.fn();

vi.mock("@/lib/api", () => ({
  fetchWithAuth: (...args: unknown[]) => fetchWithAuthMock(...args),
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

import { authService } from "@/services/authService";

describe("authService.getMe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("usa fetchWithAuth sin skipAuthRefresh cuando no se pasa accessToken y hay sesión", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ isLoggedIn: true }),
    } as Response);

    fetchWithAuthMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: { id: "user-1" },
      message: "OK",
    });

    await authService.getMe();

    expect(fetchWithAuthMock).toHaveBeenCalledWith("/auth/me", {
      method: "GET",
      credentials: "include",
    });
    expect(fetchWithAuthMock).toHaveBeenCalledWith(
      "/auth/me",
      expect.not.objectContaining({ skipAuthRefresh: true }),
    );
  });

  it("retorna 401 sin llamar fetchWithAuth cuando no hay sesión", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ isLoggedIn: false }),
    } as Response);

    const result = await authService.getMe();

    expect(result).toEqual({
      ok: false,
      message: "No estás autenticado",
      status: 401,
      data: null,
    });
    expect(fetchWithAuthMock).not.toHaveBeenCalled();
  });

  it("usa skipAuthRefresh cuando se pasa accessToken explícito", async () => {
    fetchWithAuthMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: { id: "user-1" },
      message: "OK",
    });

    await authService.getMe("explicit-token");

    expect(fetch).not.toHaveBeenCalled();
    expect(fetchWithAuthMock).toHaveBeenCalledWith("/auth/me", {
      method: "GET",
      skipAuthRefresh: true,
      credentials: "include",
      headers: { Authorization: "Bearer explicit-token" },
    });
  });
});
