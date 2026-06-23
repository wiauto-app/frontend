import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  API_URL: "http://localhost:3001/api",
}));

import { refreshTokenService } from "@/app/(auth)/services/refreshTokenService";

describe("refreshTokenService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("formatea Cookie como refresh_token=<value>", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ ok: true, data: {} }),
    } as Response);

    await refreshTokenService.refreshToken("abc123hash");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/refresh",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Cookie: "refresh_token=abc123hash",
        }),
      }),
    );
  });
});
