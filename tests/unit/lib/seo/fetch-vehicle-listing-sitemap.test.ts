import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/constants", () => ({
  API_URL: "https://api.test",
  FRONTEND_URL: "https://www.wiauto.test",
}));

import {
  fetchVehicleListingSitemapMeta,
  fetchVehicleListingSitemapPage,
} from "@/lib/seo/fetch-vehicle-listing-sitemap";

describe("fetchVehicleListingSitemap", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("obtiene meta del sitemap de catálogo", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: { total: 2, limit: 5000, totalPages: 1, variant: "catalog" },
        }),
        { status: 200 },
      ),
    );

    const meta = await fetchVehicleListingSitemapMeta("catalog");

    expect(meta.totalPages).toBe(1);
    expect(meta.variant).toBe("catalog");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/v1/sitemap/vehicle-listings/meta?variant=catalog",
      expect.objectContaining({ next: { revalidate: 3600 } }),
    );
  });

  it("obtiene una página del sitemap con provincia", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: {
            data: [
              {
                makeSlug: "toyota",
                modelSlug: "avensis",
                provinceSlug: "tarragona",
              },
            ],
            total: 1,
            page: 1,
            limit: 5000,
            totalPages: 1,
          },
        }),
        { status: 200 },
      ),
    );

    const page = await fetchVehicleListingSitemapPage("with-province", 1);

    expect(page.data[0]?.provinceSlug).toBe("tarragona");
  });
});
