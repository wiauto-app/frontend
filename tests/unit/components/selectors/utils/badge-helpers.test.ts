import { describe, expect, it, vi } from "vitest";

import { buildMakeLogoBadges } from "@/components/selectors/utils/build-make-logo-badges";
import { buildPopularProvinceBadges } from "@/components/selectors/utils/build-province-badges";
import { heroFacetService } from "@/services/search/heroFacetService";
import { makeService } from "@/services/vehicles/makeService";

vi.mock("@/services/search/heroFacetService", () => ({
  heroFacetService: {
    getProvinces: vi.fn(),
    getMakes: vi.fn(),
  },
}));

vi.mock("@/services/vehicles/makeService", () => ({
  makeService: {
    findAll: vi.fn(),
  },
}));

describe("buildPopularProvinceBadges", () => {
  it("ordena por vehicle_count y respeta el límite", async () => {
    vi.mocked(heroFacetService.getProvinces).mockResolvedValue([
      { id: 1, slug: "madrid", name: "Madrid", vehicle_count: 120 },
      { id: 2, slug: "barcelona", name: "Barcelona", vehicle_count: 200 },
      { id: 3, slug: "valencia", name: "Valencia", vehicle_count: 80 },
    ]);

    const badges = await buildPopularProvinceBadges(2);

    expect(badges).toEqual([
      { slug: "barcelona", name: "Barcelona" },
      { slug: "madrid", name: "Madrid" },
    ]);
  });
});

describe("buildMakeLogoBadges", () => {
  it("omite marcas sin image_url y ordena por popularidad", async () => {
    vi.mocked(makeService.findAll).mockResolvedValue({
      data: [
        {
          id: "1",
          name: "BMW",
          slug: "bmw",
          image_url: "files/makes/bmw.png",
          created_at: "2024-01-01",
        },
        {
          id: "2",
          name: "Audi",
          slug: "audi",
          image_url: null,
          created_at: "2024-01-01",
        },
        {
          id: "3",
          name: "Toyota",
          slug: "toyota",
          image_url: "files/makes/toyota.png",
          created_at: "2024-01-01",
        },
      ],
      total: 3,
      page: 1,
      limit: 200,
    });

    vi.mocked(heroFacetService.getMakes).mockResolvedValue([
      { id: 1, slug: "bmw", name: "BMW", vehicle_count: 50 },
      { id: 2, slug: "audi", name: "Audi", vehicle_count: 300 },
      { id: 3, slug: "toyota", name: "Toyota", vehicle_count: 120 },
    ]);

    const badges = await buildMakeLogoBadges(2);

    expect(badges).toEqual([
      {
        slug: "toyota",
        name: "Toyota",
        image_url: "files/makes/toyota.png",
      },
      {
        slug: "bmw",
        name: "BMW",
        image_url: "files/makes/bmw.png",
      },
    ]);
  });
});
