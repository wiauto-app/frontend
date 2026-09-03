import { describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://www.wiauto.test",
}));

import { buildVehicleSitemapIndexXml } from "@/lib/seo/build-vehicle-sitemap-index";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";

describe("vehicle sitemap index", () => {
  it("genera ids de segmento coherentes con totalPages", () => {
    expect(getVehicleSitemapSegmentIds(0)).toEqual(["0"]);
    expect(getVehicleSitemapSegmentIds(1)).toEqual(["0"]);
    expect(getVehicleSitemapSegmentIds(3)).toEqual(["0", "1", "2"]);
  });

  it("genera xml de sitemap index con todas las paginas", () => {
    const xml = buildVehicleSitemapIndexXml(
      ["0", "1"],
      "2026-09-02T12:00:00.000Z",
    );

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain(
      "https://www.wiauto.test/vehiculo/sitemap/0.xml",
    );
    expect(xml).toContain(
      "https://www.wiauto.test/vehiculo/sitemap/1.xml",
    );
    expect(xml).toContain("<lastmod>2026-09-02T12:00:00.000Z</lastmod>");
  });
});
