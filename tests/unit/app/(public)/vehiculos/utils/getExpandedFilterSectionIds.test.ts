import { describe, expect, it } from "vitest";

import {
  FILTER_SECTION_IDS,
  getExpandedFilterSectionIds,
} from "@/app/(public)/vehiculos/utils/getExpandedFilterSectionIds";

describe("getExpandedFilterSectionIds", () => {
  it("devuelve vacío sin filtros", () => {
    expect(getExpandedFilterSectionIds({})).toEqual([]);
  });

  it("abre marca, precio y vendedores", () => {
    expect(
      getExpandedFilterSectionIds({
        makes_slugs: ["toyota", "abarth"],
        since_price: 1000,
        until_price: 14000,
        publisher_types: ["professional"],
      }),
    ).toEqual([
      FILTER_SECTION_IDS.MAKE_MODEL,
      FILTER_SECTION_IDS.PRICE,
      FILTER_SECTION_IDS.SELLERS,
    ]);
  });

  it("abre tipo de vehículo", () => {
    expect(getExpandedFilterSectionIds({ type_slug: "ocasion" })).toEqual([
      FILTER_SECTION_IDS.VEHICLE_TYPE,
    ]);
  });

  it("abre ubicación con coordenadas y radio", () => {
    expect(
      getExpandedFilterSectionIds({
        lat: 40.4168,
        lng: -3.7038,
        radius: 25_000,
      }),
    ).toEqual([FILTER_SECTION_IDS.LOCATION]);
  });

  it("abre ubicación con provincias o municipios", () => {
    expect(
      getExpandedFilterSectionIds({ municipalities_slugs: ["madrid"] }),
    ).toEqual([FILTER_SECTION_IDS.LOCATION]);
    expect(
      getExpandedFilterSectionIds({ provinces_slugs: ["madrid"] }),
    ).toEqual([FILTER_SECTION_IDS.LOCATION]);
  });

  it("abre motor con combustible o transmisión", () => {
    expect(
      getExpandedFilterSectionIds({ fuel_type_slugs: ["diesel"] }),
    ).toEqual([FILTER_SECTION_IDS.ENGINE]);
    expect(
      getExpandedFilterSectionIds({ transmission_types: ["automatic"] }),
    ).toEqual([FILTER_SECTION_IDS.ENGINE]);
  });

  it("abre eléctricos con autonomía o batería", () => {
    expect(getExpandedFilterSectionIds({ autonomy_since: 300 })).toEqual([
      FILTER_SECTION_IDS.ELECTRIC,
    ]);
    expect(
      getExpandedFilterSectionIds({ battery_capacity_until: 80 }),
    ).toEqual([FILTER_SECTION_IDS.ELECTRIC]);
  });
});
