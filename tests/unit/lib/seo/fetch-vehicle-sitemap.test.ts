import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/constants", () => ({
  API_URL: "https://api.test",
  FRONTEND_URL: "https://www.wiauto.test",
}));

import {
  fetchVehicleSitemapMeta,
  fetchVehicleSitemapPage,
} from "@/lib/seo/fetch-vehicle-sitemap";

describe("fetchVehicleSitemap", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("obtiene meta del sitemap", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: { total: 2, limit: 5000, totalPages: 1 },
        }),
        { status: 200 },
      ),
    );

    const meta = await fetchVehicleSitemapMeta();

    expect(meta.totalPages).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/v1/sitemap/vehicles/meta",
      expect.objectContaining({ next: { revalidate: 3600 } }),
    );
  });

  it("obtiene una página del sitemap", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: {
            data: [{ id: "veh-1", updatedAt: "2026-09-02T12:00:00.000Z", isFeatured: true }],
            total: 1,
            page: 1,
            limit: 5000,
            totalPages: 1,
          },
        }),
        { status: 200 },
      ),
    );

    const page = await fetchVehicleSitemapPage(1);

    expect(page.data[0]?.id).toBe("veh-1");
  });
});
