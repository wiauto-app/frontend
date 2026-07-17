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

  it("mapea schedules a texto legible en contacto", () => {
    const profile = mapDealershipToDealerProfile({
      dealership: buildMockDealership({
        schedules: [
          {
            day: 1,
            open_times: [
              { open_time: "09:00", close_time: "14:00" },
              { open_time: "16:00", close_time: "20:00" },
            ],
          },
          {
            day: 6,
            open_times: [{ open_time: "10:00:00", close_time: "14:00:00" }],
          },
        ],
      }),
      reviews: [],
      reviewTotal: 0,
      publishedVehicles: 0,
    });

    expect(profile.contact.schedule).toContain(
      "Lunes: 09:00–14:00, 16:00–20:00",
    );
    expect(profile.contact.schedule).toContain("Martes: Cerrado");
    expect(profile.contact.schedule).toContain("Sábado: 10:00–14:00");
    expect(profile.contact.schedule).toContain("Domingo: Cerrado");
  });

  it("no expone schedule si no hay tramos abiertos", () => {
    const profile = mapDealershipToDealerProfile({
      dealership: buildMockDealership({
        schedules: [{ day: 1, open_times: [] }],
      }),
      reviews: [],
      reviewTotal: 0,
      publishedVehicles: 0,
    });

    expect(profile.contact.schedule).toBeUndefined();
  });
});
