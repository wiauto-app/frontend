import { describe, expect, it } from "vitest";

import { buildListingHrefFromApiQuery } from "./index";

describe("buildListingHrefFromApiQuery", () => {
  it("vuelve al listado base con query vacío o inválido", () => {
    expect(buildListingHrefFromApiQuery({})).toBe("/vehiculos");
    expect(buildListingHrefFromApiQuery(null)).toBe("/vehiculos");
    expect(buildListingHrefFromApiQuery(["bmw"])).toBe("/vehiculos");
  });

  it("mapea claves DTO a la URL amigable del listado", () => {
    const href = buildListingHrefFromApiQuery({
      makes_slugs: ["bmw"],
      models_slugs: ["serie-3"],
      fuel_type_slugs: ["diesel"],
      since_year: 2018,
      until_year: 2022,
      until_price: 30000,
    });
    const url = new URL(href, "https://wiauto.test");

    expect(url.pathname.startsWith("/vehiculos")).toBe(true);
    expect(url.searchParams.get("marcas")).toBe("bmw");
    expect(url.searchParams.get("modelos")).toBe("serie-3");
    expect(url.searchParams.get("combustible")).toBe("diesel");
    expect(url.searchParams.get("anio_desde")).toBe("2018");
    expect(url.searchParams.get("anio_hasta")).toBe("2022");
    expect(url.searchParams.get("precio_hasta")).toBe("30000");
  });

  it("normaliza tipos laxos y descarta paginación y claves desconocidas", () => {
    const href = buildListingHrefFromApiQuery({
      fuel_type_slugs: "diesel,gasolina",
      price_offer: "true",
      since_price: "5000",
      page: 4,
      limit: 50,
      unknown_key: "x",
    });
    const url = new URL(href, "https://wiauto.test");

    expect(url.searchParams.get("combustible")).toBe("diesel,gasolina");
    expect(url.searchParams.get("oferta")).toBe("true");
    expect(url.searchParams.get("precio_desde")).toBe("5000");
    expect(url.searchParams.has("pagina")).toBe(false);
    expect(url.searchParams.has("limite")).toBe(false);
    expect(url.searchParams.has("unknown_key")).toBe(false);
  });

  it("conserva el texto libre y claves sin alias amigable", () => {
    const href = buildListingHrefFromApiQuery({
      query: "golf gti",
      power_since: 150,
    });
    const url = new URL(href, "https://wiauto.test");

    expect(url.searchParams.get("q")).toBe("golf gti");
    expect(url.searchParams.get("power_since")).toBe("150");
  });
});
