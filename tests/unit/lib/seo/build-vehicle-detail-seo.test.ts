import { describe, expect, it, vi } from "vitest";

import type { Vehicle } from "@/interfaces/vehicle.interface";
import { buildVehicleDetailSeo } from "@/lib/seo/build-vehicle-detail-seo";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://wiauto.test",
}));

vi.mock("@/lib/utils", () => ({
  getImageUrl: (key: string) => `https://media.test/${key}`,
}));

const formatEur = (price: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

const buildMockVehicle = (overrides: Partial<Vehicle> = {}): Vehicle =>
  ({
    id: "veh-1",
    price: 18500,
    mileage: 42000,
    power: 115,
    status: "active",
    condition: "used",
    transmission_type: "manual",
    description: "Descripción del vehículo de prueba para SEO.",
    created_at: "2024-03-01T10:00:00.000Z",
    updated_at: "2024-06-15T12:30:00.000Z",
    address_details: {
      municipality: "Madrid",
      formatted_lines: ["Madrid"],
    },
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
      body_type: { name: "Berlina" },
      fuel_type: { name: "Diésel" },
    },
    ...overrides,
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

  it("genera un title con año, ocasión, precio y marca dentro de 60 caracteres", () => {
    const seo = buildVehicleDetailSeo(buildMockVehicle());
    const price = formatEur(18500);

    expect(seo.metadata.title).toBe(
      `Volkswagen Golf 1.6 TDI 2020 de ocasión · ${price} | WiAuto`,
    );
    expect(String(seo.metadata.title).length).toBeLessThanOrEqual(60);
    expect(seo.metadata.description).toBe(
      `Volkswagen Golf 1.6 TDI del 2020 en venta en WiAuto, Madrid. Berlina diésel, 115 CV, cambio manual y ${Number(42000).toLocaleString("es-ES")} km. Precio: ${price}.`,
    );
    expect(String(seo.metadata.description).length).toBeLessThanOrEqual(160);
    expect(seo.metadata.description).not.toContain("...");
    expect(seo.metadata.robots).toBeUndefined();
    expect(seo.metadata.alternates?.canonical).toBe(
      "https://wiauto.test/vehiculo/veh-1",
    );
    expect(seo.metadata.openGraph).toMatchObject({
      title: seo.metadata.title,
      description: seo.metadata.description,
      url: "https://wiauto.test/vehiculo/veh-1",
    });
    expect(seo.metadata.twitter?.card).toBe("summary_large_image");
  });

  it("acota el title cuando el nombre comercial es muy largo", () => {
    const seo = buildVehicleDetailSeo(
      buildMockVehicle({
        version: {
          name: "220 d 4MATIC AMG Line Premium Plus Largo",
          slug: "220-d",
          make: {
            id: "2",
            name: "Mercedes-Benz",
            slug: "mercedes-benz",
            created_at: "",
          },
          model: {
            id: 2,
            make_id: "2",
            name: "Clase C Estate",
            slug: "clase-c-estate",
            created_at: "",
          },
          year: { id: 1, year: 2019, slug: "2019", created_at: new Date() },
        },
      } as Partial<Vehicle>),
    );

    expect(String(seo.metadata.title).endsWith(" | WiAuto")).toBe(true);
    expect(String(seo.metadata.title).length).toBeLessThanOrEqual(60);
    expect(String(seo.metadata.description).length).toBeLessThanOrEqual(160);
  });

  it("marca nuevo en el title cuando el vehículo es nuevo", () => {
    const seo = buildVehicleDetailSeo(buildMockVehicle({ condition: "new" }));

    expect(seo.metadata.title).toContain("nuevo");
    expect(seo.metadata.title).not.toContain("de ocasión");
  });

  it("marca noindex nofollow cuando el vehículo no está active", () => {
    const seo = buildVehicleDetailSeo(buildMockVehicle({ status: "sold" }));

    expect(seo.metadata.robots).toEqual({ index: false, follow: false });
  });

  it("genera JSON-LD @graph con BreadcrumbList, WebPage y Car", () => {
    const seo = buildVehicleDetailSeo(buildMockVehicle());
    const graph = seo.jsonLdGraph["@graph"] as Array<Record<string, unknown>>;

    expect(seo.jsonLdGraph["@context"]).toBe("https://schema.org");
    expect(graph).toHaveLength(3);
    expect(graph[0]["@type"]).toBe("BreadcrumbList");
    expect(graph[1]).toMatchObject({
      "@type": "WebPage",
      "@id": "https://wiauto.test/vehiculo/veh-1#webpage",
      url: "https://wiauto.test/vehiculo/veh-1",
      inLanguage: "es-ES",
      datePublished: "2024-03-01T10:00:00.000Z",
      dateModified: "2024-06-15T12:30:00.000Z",
      mainEntity: { "@id": "https://wiauto.test/vehiculo/veh-1#vehicle" },
    });
    expect(graph[2]["@type"]).toBe("Car");
    expect(graph[2]["@id"]).toBe("https://wiauto.test/vehiculo/veh-1#vehicle");
    expect(graph[2].name).toBe("Volkswagen Golf 1.6 TDI");
    expect(graph[2].brand).toEqual({ "@type": "Brand", name: "Volkswagen" });
    expect(graph[2].model).toBe("Golf");
    expect(graph[2].vehicleModelDate).toBe("2020");
    expect(graph[2].offers).toMatchObject({
      "@type": "Offer",
      price: 18500,
      priceCurrency: "EUR",
    });
  });
});
