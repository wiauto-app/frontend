import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/(auth)/services/refreshTokenService", () => ({
  refreshTokenService: {
    refreshToken: vi.fn(),
  },
}));

vi.mock("@/constants", () => ({
  API_URL: "http://localhost:3001/api",
}));

import { ensureValidSession } from "@/lib/ensure-session.server";
import { refreshTokenService } from "@/app/(auth)/services/refreshTokenService";

const buildJwtWithScope = (scope: string): string => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url",
  );
  const payload = Buffer.from(JSON.stringify({ scope })).toString("base64url");
  return `${header}.${payload}.signature`;
};

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
