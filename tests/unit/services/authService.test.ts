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
  buildApiUrl: (path: string) => `http://localhost:3001/api${path}`,
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

  it("desenvuelve pending_vehicle_id del ResponseInterceptor en register", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        status: 200,
        data: {
          message: "Te enviamos un correo con el enlace de verificación.",
          data: { id: "user-1", email: "a@b.com" },
          referral_code: "REF1",
          pending_vehicle_id: "vehicle-draft-1",
        },
      }),
    } as Response);

    const result = await authService.register({
      email: "a@b.com",
      password: "secret123",
      name: "Ana",
      phone_code: "+34",
      phone: "600000000",
    });

    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ id: "user-1", email: "a@b.com" });
    expect(result.referral_code).toBe("REF1");
    expect(result.pending_vehicle_id).toBe("vehicle-draft-1");
  });

  it("desenvuelve pending_vehicle_queued del ResponseInterceptor en register", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        status: 200,
        data: {
          message: "Te enviamos un correo con el enlace de verificación.",
          data: { id: "user-1", email: "a@b.com" },
          pending_vehicle_queued: true,
        },
      }),
    } as Response);

    const result = await authService.register({
      email: "a@b.com",
      password: "secret123",
      name: "Ana",
      phone_code: "+34",
      phone: "600000000",
    });

    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ id: "user-1", email: "a@b.com" });
    expect(result.pending_vehicle_queued).toBe(true);
    expect(result.pending_vehicle_id).toBeUndefined();
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
