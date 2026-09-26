import { describe, expect, it, vi } from "vitest";

import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import {
  buildVehicleListingCopy,
  buildVehicleListingJsonLd,
  buildVehicleListingMetadata,
} from "@/lib/seo/build-vehicle-listing-seo";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://wiauto.test",
}));

const buildVehicle = (id: string, make: string, model: string): VehicleListItem =>
  ({
    id,
    version_summary: {
      make_name: make,
      model_name: model,
      version_name: "1.6",
      fuel_name: "Gasolina",
    },
  }) as VehicleListItem;

describe("buildVehicleListingCopy", () => {
  it("usa un título estable en el catálogo general, sin recuento ni orden", () => {
    const copy = buildVehicleListingCopy(
      "Vehículos de segunda mano más recientes",
    );

    expect(copy.title).toBe("Coches de segunda mano y ocasión | WiAuto");
    expect(copy.title.length).toBeLessThanOrEqual(60);
    expect(copy.description).toBe(
      "Coches de segunda mano y ocasión en WiAuto. Compara precio, kilómetros y ubicación, y contacta con particulares y concesionarios.",
    );
    expect(copy.description.length).toBeLessThanOrEqual(160);
    expect(copy.description).not.toContain("resultados");
  });

  it("conserva el filtro y añade la marca, sin el orden por defecto", () => {
    const copy = buildVehicleListingCopy(
      "BMW Serie 3 de segunda mano en Madrid más recientes",
    );

    expect(copy.title).toBe("BMW Serie 3 de segunda mano en Madrid | WiAuto");
    expect(copy.description.startsWith("BMW Serie 3 de segunda mano en Madrid en WiAuto.")).toBe(
      true,
    );
    expect(copy.description.length).toBeLessThanOrEqual(160);
  });

  it("acota títulos de filtro muy largos", () => {
    const copy = buildVehicleListingCopy(
      "Mercedes-Benz Clase C Estate 220 d 4MATIC de segunda mano en Madrid más baratos",
    );

    expect(copy.title.endsWith(" | WiAuto")).toBe(true);
    expect(copy.title.length).toBeLessThanOrEqual(60);
    expect(copy.description.length).toBeLessThanOrEqual(160);
    expect(copy.title).not.toContain("más baratos");
  });
});

describe("buildVehicleListingMetadata", () => {
  it("marca noindex y publica canonical, openGraph y twitter", () => {
    const metadata = buildVehicleListingMetadata("Vehículos de segunda mano", {
      canonical: "https://wiauto.test/vehiculos",
      noindex: true,
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe("https://wiauto.test/vehiculos");
    expect(metadata.openGraph).toMatchObject({
      title: metadata.title,
      description: metadata.description,
      url: "https://wiauto.test/vehiculos",
    });
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });
});

describe("buildVehicleListingJsonLd", () => {
  it("genera un ItemList con la posición real de la página", () => {
    const jsonLd = buildVehicleListingJsonLd({
      title: "Coches de segunda mano y ocasión | WiAuto",
      description: "Coches de segunda mano y ocasión en WiAuto.",
      canonicalUrl: "https://wiauto.test/vehiculos",
      page: 2,
      limit: 2,
      vehicles: [
        buildVehicle("veh-1", "Toyota", "Corolla"),
        buildVehicle("veh-2", "Ford", "Cougar"),
      ],
    });

    expect(jsonLd["@type"]).toBe("ItemList");
    expect(jsonLd.numberOfItems).toBe(2);
    expect(jsonLd.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 3,
        url: "https://wiauto.test/vehiculo/veh-1",
        name: "Toyota Corolla 1.6",
      },
      {
        "@type": "ListItem",
        position: 4,
        url: "https://wiauto.test/vehiculo/veh-2",
        name: "Ford Cougar 1.6",
      },
    ]);
  });
});
