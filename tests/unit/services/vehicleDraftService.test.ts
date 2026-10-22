import { describe, expect, it, vi, beforeEach } from "vitest";

import { vehicleDraftService } from "@/services/vehicleDraftService";

vi.mock("@/lib/api", () => ({
  apiGet: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

import { apiDelete, apiGet, apiPut } from "@/lib/api";

describe("vehicleDraftService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMine llama al endpoint del borrador del usuario", async () => {
    vi.mocked(apiGet).mockResolvedValue({ ok: true, data: null });

    await vehicleDraftService.getMine();

    expect(apiGet).toHaveBeenCalledWith("/v1/vehicle-drafts/me");
  });

  it("saveMine envía PUT con el payload del borrador", async () => {
    vi.mocked(apiPut).mockResolvedValue({
      ok: true,
      data: {
        id: "draft-1",
        profile_id: "profile-1",
        values: { title: "Prueba" },
        step: 1,
        appraisal_id: null,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    });

    await vehicleDraftService.saveMine({
      values: { title: "Prueba" },
      step: 1,
    });

    expect(apiPut).toHaveBeenCalledWith("/v1/vehicle-drafts/me", {
      values: { title: "Prueba" },
      step: 1,
    });
  });

  it("removeMine llama a DELETE", async () => {
    vi.mocked(apiDelete).mockResolvedValue({ ok: true, data: null });

    await vehicleDraftService.removeMine();

    expect(apiDelete).toHaveBeenCalledWith("/v1/vehicle-drafts/me");
  });
});
