import { describe, expect, it, vi } from "vitest";

import type { Vehicle } from "@/interfaces/vehicle.interface";
import { buildVehicleDetailSeo } from "@/lib/seo/build-vehicle-detail-seo";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://wiauto.test",
}));

vi.mock("@/lib/utils", () => ({
  getImageUrl: (key: string) => `https://media.test/${key}`,
}));

const buildMockVehicle = (): Vehicle =>
  ({
    id: "veh-1",
    price: 18500,
    mileage: 42000,
    description: "Descripción del vehículo de prueba para SEO.",
    images: [{ id: "img-1", url: "vehicles/car.jpg" }],
    version: {
      name: "1.6 TDI",
      slug: "16-tdi",
      make: { id: "1", name: "Volkswagen", slug: "volkswagen", created_at: "" },
      model: {
        id: 1,
        make_id: "1",
        name: "Golf",
        slug: "golf",
        created_at: "",
      },
      year: { id: 1, year: 2020, slug: "2020", created_at: new Date() },
    },
  }) as Vehicle;

describe("buildVehicleDetailSeo", () => {
  it("genera breadcrumbs de 5 niveles con hrefs de catálogo", () => {
    const seo = buildVehicleDetailSeo(buildMockVehicle());

    expect(seo.breadcrumbItems).toHaveLength(5);
    expect(seo.breadcrumbItems[0]).toEqual({ label: "Inicio", href: "/" });
    expect(seo.breadcrumbItems[1]).toEqual({
      label: "Vehículos",
      href: "/vehiculos",
    });
    expect(seo.breadcrumbItems[2]).toEqual({
      label: "Volkswagen",
      href: "/vehiculos?marcas=volkswagen",
    });
    expect(seo.breadcrumbItems[3]).toEqual({
      label: "Golf",
      href: "/vehiculos?marcas=volkswagen&modelos=golf",
    });
    expect(seo.breadcrumbItems[4]).toEqual({
      label: "Volkswagen Golf 1.6 TDI",
    });
  });

  it("genera metadata con canonical, openGraph y twitter", () => {
    const seo = buildVehicleDetailSeo(buildMockVehicle());

    expect(seo.metadata.title).toBe("Volkswagen Golf 1.6 TDI");
    expect(seo.metadata.alternates?.canonical).toBe(
      "https://wiauto.test/vehiculo/veh-1",
    );
    expect(seo.metadata.openGraph?.url).toBe(
      "https://wiauto.test/vehiculo/veh-1",
    );
    expect(seo.metadata.twitter?.card).toBe("summary_large_image");
  });

  it("genera JSON-LD @graph con BreadcrumbList y Car", () => {
    const seo = buildVehicleDetailSeo(buildMockVehicle());
    const graph = seo.jsonLdGraph["@graph"] as Array<Record<string, unknown>>;

    expect(seo.jsonLdGraph["@context"]).toBe("https://schema.org");
    expect(graph).toHaveLength(2);
    expect(graph[0]["@type"]).toBe("BreadcrumbList");
    expect(graph[1]["@type"]).toBe("Car");
    expect(graph[1].brand).toEqual({ "@type": "Brand", name: "Volkswagen" });
    expect(graph[1].model).toBe("Golf");
    expect(graph[1].vehicleModelDate).toBe("2020");
    expect(graph[1].offers).toMatchObject({
      "@type": "Offer",
      price: 18500,
      priceCurrency: "EUR",
    });
  });
});
