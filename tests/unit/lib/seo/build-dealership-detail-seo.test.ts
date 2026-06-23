import { describe, expect, it, vi } from "vitest";

import { buildDealershipDetailSeo } from "@/lib/seo/build-dealership-detail-seo";
import type { DealershipDetail } from "@/services/dealerships/types/dealership.types";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://wiauto.test",
}));

vi.mock("@/lib/utils", () => ({
  getImageUrl: (key: string) => `https://media.test/${key}`,
}));

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
    lat: 40.4168,
    lng: -3.7038,
    banner_url: "dealerships/banner.jpg",
    avatar_url: "dealerships/avatar.jpg",
    is_featured: true,
    show_phone: true,
    rating: 4.5,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    members_count: 3,
    reviews_count: 10,
    ...overrides,
  }) as DealershipDetail;

describe("buildDealershipDetailSeo", () => {
  it("genera breadcrumbs de 3 niveles", () => {
    const seo = buildDealershipDetailSeo({
      dealership: buildMockDealership(),
    });

    expect(seo.breadcrumbItems).toEqual([
      { label: "Inicio", href: "/" },
      { label: "Concesionarios", href: "/concesionarias" },
      { label: "Auto Norte Madrid" },
    ]);
  });

  it("genera metadata con canonical y openGraph", () => {
    const seo = buildDealershipDetailSeo({
      dealership: buildMockDealership(),
    });

    expect(seo.metadata.title).toBe(
      "Auto Norte Madrid | Concesionarios | WiAuto",
    );
    expect(seo.metadata.alternates?.canonical).toBe(
      "https://wiauto.test/concesionaria/auto-norte-madrid",
    );
    expect(seo.metadata.openGraph?.images).toEqual([
      { url: "https://media.test/dealerships/banner.jpg" },
    ]);
  });

  it("incluye telephone en JSON-LD cuando show_phone es true", () => {
    const seo = buildDealershipDetailSeo({
      dealership: buildMockDealership({ show_phone: true }),
      reviewCount: 5,
      rating: 4.5,
    });
    const autoDealer = (seo.jsonLdGraph["@graph"] as Array<Record<string, unknown>>)[1];

    expect(autoDealer["@type"]).toBe("AutoDealer");
    expect(autoDealer.telephone).toBe("+34 912345678");
    expect(autoDealer.aggregateRating).toMatchObject({
      ratingValue: 4.5,
      reviewCount: 5,
    });
  });

  it("omite telephone en JSON-LD cuando show_phone es false", () => {
    const seo = buildDealershipDetailSeo({
      dealership: buildMockDealership({ show_phone: false }),
    });
    const autoDealer = (seo.jsonLdGraph["@graph"] as Array<Record<string, unknown>>)[1];

    expect(autoDealer.telephone).toBeUndefined();
  });
});
