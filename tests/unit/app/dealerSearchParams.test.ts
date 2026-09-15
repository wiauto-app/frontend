import { describe, expect, it } from "vitest";

import {
  buildDealersSearchParams,
  parseDealerSearchParams,
} from "@/app/(public)/concesionarios/utils/dealerSearchParams";

describe("dealerSearchParams", () => {
  it("parses the dealership filters used by the server request", () => {
    expect(
      parseDealerSearchParams({
        q: "  autos norte  ",
        province_slug: "pichincha",
        radius: "40",
        rating_since: "4",
        vehicles_number: "25",
        page: "2",
        limit: "24",
        sort: "rating-desc",
      }),
    ).toEqual({
      query: "autos norte",
      province_slug: "pichincha",
      radius: 40,
      rating_since: 4,
      vehicles_number: 25,
      page: 2,
      limit: 24,
      sort: "rating-desc",
    });
  });

  it("ignores invalid and incomplete filter values", () => {
    expect(
      parseDealerSearchParams({
        radius: "50",
        rating_since: "8",
        vehicles_number: "-1",
        page: "0",
        limit: "1000",
        sort: "unknown",
      }),
    ).toEqual({ limit: 12 });
  });

  it("serializes active filters using the public URL keys", () => {
    const result = buildDealersSearchParams({
      province_slug: "guayas",
      radius: 30,
      rating_since: 3,
      vehicles_number: 10,
      page: 3,
      sort: "vehicles-desc",
    });

    expect(result.toString()).toBe(
      "province_slug=guayas&radius=30&rating_since=3&vehicles_number=10&page=3&sort=vehicles-desc",
    );
  });
});
