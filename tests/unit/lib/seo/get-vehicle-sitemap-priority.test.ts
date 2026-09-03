import { describe, expect, it } from "vitest";

import { getVehicleSitemapPriority } from "@/lib/seo/get-vehicle-sitemap-priority";
import {
  VEHICLE_SITEMAP_PRIORITY_DEFAULT,
  VEHICLE_SITEMAP_PRIORITY_FEATURED,
} from "@/lib/seo/vehicle-sitemap.constants";

describe("getVehicleSitemapPriority", () => {
  it("asigna mayor prioridad a vehículos destacados activos", () => {
    expect(getVehicleSitemapPriority(true)).toBe(
      VEHICLE_SITEMAP_PRIORITY_FEATURED,
    );
    expect(getVehicleSitemapPriority(false)).toBe(
      VEHICLE_SITEMAP_PRIORITY_DEFAULT,
    );
    expect(VEHICLE_SITEMAP_PRIORITY_FEATURED).toBeGreaterThan(
      VEHICLE_SITEMAP_PRIORITY_DEFAULT,
    );
  });
});
