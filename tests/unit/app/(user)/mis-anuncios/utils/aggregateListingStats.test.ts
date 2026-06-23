import { describe, expect, it } from "vitest";

import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { aggregateListingStats } from "@/app/(user)/mis-anuncios/utils/aggregateListingStats";

const createListing = (
  overrides: Partial<OwnerVehicleListItem> = {},
): OwnerVehicleListItem => ({
  id: "vehicle-1",
  display_name: "Toyota Corolla",
  price: 15000,
  mileage: 45000,
  status: "active",
  expires_at: "2026-12-31T00:00:00.000Z",
  is_expired: false,
  days_until_expiry: 180,
  can_renew: true,
  can_schedule: false,
  is_featured: false,
  featured_expires_at: null,
  is_featured_active: false,
  can_feature: true,
  transmission_type: "manual",
  fuel_type: "Gasolina",
  scheduled_publish_at: null,
  renewed_at: null,
  image: null,
  stats: {
    views: { current: 10, previous: 5, change_percent: 100 },
    leads: { current: 2, previous: 1, change_percent: 100 },
    favorites: { current: 3, previous: 3, change_percent: 0 },
    shares: { current: 0, previous: 0, change_percent: null },
  },
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("aggregateListingStats", () => {
  it("suma las métricas current y previous de todos los anuncios", () => {
    const listings = [
      createListing({
        id: "a",
        stats: {
          views: { current: 10, previous: 5, change_percent: 100 },
          leads: { current: 2, previous: 1, change_percent: 100 },
          favorites: { current: 1, previous: 0, change_percent: 100 },
          shares: { current: 0, previous: 0, change_percent: null },
        },
      }),
      createListing({
        id: "b",
        status: "inactive",
        stats: {
          views: { current: 20, previous: 10, change_percent: 100 },
          leads: { current: 4, previous: 2, change_percent: 100 },
          favorites: { current: 2, previous: 1, change_percent: 100 },
          shares: { current: 0, previous: 0, change_percent: null },
        },
      }),
    ];

    const result = aggregateListingStats(listings);

    expect(result.views.current).toBe(30);
    expect(result.views.previous).toBe(15);
    expect(result.leads.current).toBe(6);
    expect(result.favorites.current).toBe(3);
    expect(result.activeCount).toBe(1);
    expect(result.totalCount).toBe(2);
  });

  it("calcula change_percent agregado a partir de totales", () => {
    const listings = [
      createListing({
        stats: {
          views: { current: 15, previous: 10, change_percent: 50 },
          leads: { current: 0, previous: 0, change_percent: null },
          favorites: { current: 0, previous: 0, change_percent: null },
          shares: { current: 0, previous: 0, change_percent: null },
        },
      }),
    ];

    const result = aggregateListingStats(listings);

    expect(result.views.change_percent).toBe(50);
  });

  it("devuelve change_percent null cuando no hay datos previos ni actuales", () => {
    const listings = [
      createListing({
        stats: {
          views: { current: 0, previous: 0, change_percent: null },
          leads: { current: 0, previous: 0, change_percent: null },
          favorites: { current: 0, previous: 0, change_percent: null },
          shares: { current: 0, previous: 0, change_percent: null },
        },
      }),
    ];

    const result = aggregateListingStats(listings);

    expect(result.views.change_percent).toBeNull();
    expect(result.leads.change_percent).toBeNull();
    expect(result.favorites.change_percent).toBeNull();
  });
});
