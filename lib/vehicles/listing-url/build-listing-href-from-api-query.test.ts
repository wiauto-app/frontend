import { describe, expect, it } from "vitest";

import { buildListingHrefFromApiQuery } from "./index";

describe("buildListingHrefFromApiQuery", () => {
  it("vuelve al listado base con query vacío o inválido", () => {
    expect(buildListingHrefFromApiQuery({})).toBe("/vehiculos");
    expect(buildListingHrefFromApiQuery(null)).toBe("/vehiculos");
    expect(buildListingHrefFromApiQuery(["bmw"])).toBe("/vehiculos");
  });

  it("mapea claves DTO a segmentos del path", () => {
    const href = buildListingHrefFromApiQuery({
      makes_slugs: ["bmw"],
      models_slugs: ["serie-3"],
      fuel_type_slugs: ["diesel"],
      since_year: 2018,
      until_year: 2022,
      until_price: 30000,
    });

    expect(href).toContain("/vehiculos/marca-bmw/modelo-serie-3");
    expect(href).toContain("combustible-diesel");
    expect(href).toContain("anio-2018-2022");
    expect(href).toContain("precio-hasta-30000");
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

    expect(href).toContain("combustible-diesel,gasolina");
    expect(href).toContain("con-oferta");
    expect(href).toContain("precio-desde-5000");
    expect(href).not.toContain("pagina=");
    expect(href).not.toContain("unknown_key");
  });

  it("conserva el texto libre en query", () => {
    const href = buildListingHrefFromApiQuery({
      query: "golf gti",
      power_since: 150,
    });
    const url = new URL(href, "https://wiauto.test");

    expect(url.searchParams.get("q")).toBe("golf gti");
    expect(href).toContain("potencia-desde-150");
  });
});
