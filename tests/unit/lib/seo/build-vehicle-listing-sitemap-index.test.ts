import { describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://www.wiauto.test",
}));

import {
  buildVehicleListingSitemapIndexEntries,
  buildVehicleListingSitemapIndexXml,
} from "@/lib/seo/build-vehicle-listing-sitemap-index";

describe("vehicle listing sitemap index", () => {
  it("genera entradas para catálogo y con provincia", () => {
    expect(buildVehicleListingSitemapIndexEntries(2, 1)).toEqual([
      { variant: "catalog", segmentId: "0" },
      { variant: "catalog", segmentId: "1" },
      { variant: "with-province", segmentId: "0" },
    ]);
  });

  it("genera xml de sitemap index con ambos tipos", () => {
    const xml = buildVehicleListingSitemapIndexXml(
      buildVehicleListingSitemapIndexEntries(1, 1),
      "2026-09-02T12:00:00.000Z",
    );

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain(
      "https://www.wiauto.test/sitemap/vehiculos/catalog/sitemap/0.xml",
    );
    expect(xml).toContain(
      "https://www.wiauto.test/sitemap/vehiculos/with-province/sitemap/0.xml",
    );
    expect(xml).toContain("<lastmod>2026-09-02T12:00:00.000Z</lastmod>");
  });
});
