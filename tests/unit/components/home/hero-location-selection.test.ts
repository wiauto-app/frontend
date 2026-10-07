import { describe, expect, it } from "vitest";

import {
  COMMUNITY_KEY,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import {
  buildHeroLocationTriggerLabel,
  toHeroLocationPayload,
} from "@/components/home/hero-location-selection";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";

const community: HeroCatalogFacetItem = {
  id: 1,
  slug: "comunidad-de-madrid",
  name: "Comunidad de Madrid",
  vehicle_count: 0,
  community_cod_ccaa: "13",
};

const province: HeroCatalogFacetItem = {
  id: 28,
  slug: "madrid",
  name: "Madrid",
  vehicle_count: 0,
  community_id: 1,
  community_cod_ccaa: "13",
  community_slug: "comunidad-de-madrid",
  community_name: "Comunidad de Madrid",
};

describe("hero-location-selection", () => {
  it("emite comunidad cuando no hay provincias hijas", () => {
    expect(toHeroLocationPayload([community], [])).toEqual({
      [COMMUNITY_KEY]: ["comunidad-de-madrid"],
    });
  });

  it("emite provincias y omite comunidad con hijos seleccionados", () => {
    expect(toHeroLocationPayload([community], [province])).toEqual({
      [PROVINCE_KEY]: ["madrid"],
    });
  });

  it("prioriza etiqueta de provincias en el trigger", () => {
    expect(
      buildHeroLocationTriggerLabel([community], [province], "Ubicación"),
    ).toBe("Madrid");
  });
});
