import { describe, expect, it } from "vitest";

import { mapDealershipToDealerProfile } from "@/app/(public)/concesionaria/[slug]/utils/mapDealershipToDealerProfile";
import type { DealershipDetail } from "@/services/dealerships/types/dealership.types";

const buildMockDealership = (
  overrides: Partial<DealershipDetail> = {},
): DealershipDetail =>
  ({
    id: "dealer-1",
    name: "Auto Norte Madrid",
    slug: "auto-norte-madrid",
    description: "Concesionario oficial en Madrid.",
    email: "contacto@autonorte.com",
    phone_code: "+34",
    phone: "912345678",
    address: "Calle Mayor 1, Madrid",
    is_featured: true,
    show_phone: true,
    rating: 4.5,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    members_count: 3,
    reviews_count: 10,
    ...overrides,
  }) as DealershipDetail;

describe("mapDealershipToDealerProfile", () => {
  it("expone teléfono cuando show_phone es true", () => {
    const profile = mapDealershipToDealerProfile({
      dealership: buildMockDealership({ show_phone: true }),
      reviews: [],
      reviewTotal: 0,
      publishedVehicles: 0,
    });

    expect(profile.contact.phone).toBe("+34 912345678");
  });

  it("oculta teléfono cuando show_phone es false", () => {
    const profile = mapDealershipToDealerProfile({
      dealership: buildMockDealership({ show_phone: false }),
      reviews: [],
      reviewTotal: 0,
      publishedVehicles: 0,
    });

    expect(profile.contact.phone).toBeUndefined();
  });
});
