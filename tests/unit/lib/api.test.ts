import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  API_URL: "http://localhost:3001/api",
}));

import { fetchWithAuth } from "@/lib/api";

describe("fetchWithAuth", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("normaliza un error vacío sin escribirlo en console.error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 401,
        statusText: "Unauthorized",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await fetchWithAuth("/auth/two-factor/challenge", {
      skipAuthRefresh: true,
    });

    expect(result).toEqual({
      ok: false,
      message: "Unauthorized",
      status: 401,
      data: {},
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("conserva el contrato normalizado de una respuesta exitosa", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          ok: true,
          status: 200,
          data: { id: "user-1" },
        }),
        {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const result = await fetchWithAuth<{ id: string }>("/auth/me", {
      skipAuthRefresh: true,
    });

    expect(result).toEqual({
      ok: true,
      message: "OK",
      status: 200,
      data: { id: "user-1" },
    });
  });
});
