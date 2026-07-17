import { describe, expect, it } from "vitest";

import {
  buildAiSearchListingHref,
  mapSearchFiltersToListingParams,
} from "./map-search-filters-to-listing-params";

describe("mapSearchFiltersToListingParams", () => {
  it("mapea toyota y precio hasta", () => {
    const params = mapSearchFiltersToListingParams("Toyota baratos", {
      makes_slugs: ["toyota"],
      until_price: 20000,
    });

    expect(params).toEqual({
      makes_slugs: ["toyota"],
      until_price: 20000,
    });
  });

  it("usa query cuando no hay filtros significativos", () => {
    const params = mapSearchFiltersToListingParams("SUV familiar", {});

    expect(params).toEqual({ query: "SUV familiar" });
  });

  it("ignora arrays vacíos y usa query como fallback", () => {
    const params = mapSearchFiltersToListingParams("Eléctricos", {
      makes_slugs: [],
      fuel_type_slugs: [],
    });

    expect(params).toEqual({ query: "Eléctricos" });
  });
});

describe("buildAiSearchListingHref", () => {
  it("construye href con toyota y precio", () => {
    const href = buildAiSearchListingHref("Toyota baratos", {
      makes_slugs: ["toyota"],
      until_price: 20000,
    });

    expect(href).toBe("/vehiculos?marcas=toyota&precio_hasta=20000");
  });

  it("fallback a q= con filtros vacíos", () => {
    const href = buildAiSearchListingHref("SUV familiar", {});

    expect(href).toBe("/vehiculos?q=SUV+familiar");
  });

  it("construye path provincia + marca en query", () => {
    const href = buildAiSearchListingHref("Toyota en Madrid", {
      makes_slugs: ["toyota"],
      provinces_slugs: ["madrid"],
    });

    expect(href).toBe("/vehiculos/provincia-madrid?marcas=toyota");
  });
});
