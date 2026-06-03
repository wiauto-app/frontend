import { describe, expect, it } from "vitest";

import {
  MUNICIPALITY_KEY,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import {
  buildLocationUrlPayload,
  isFullProvinceMunicipalitySelection,
  normalizeSelectedItemsForProvince,
} from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import type { LocationSelectedItem } from "@/components/selectors/FilterLocationSelector/interfaces/locationSelector.interface";

const madrid_province: HeroCatalogFacetItem = {
  id: 28,
  slug: "madrid",
  name: "Madrid",
  vehicle_count: 100,
};

const madrid_municipalities: HeroCatalogFacetItem[] = [
  {
    id: 1,
    slug: "alcala-de-henares",
    name: "Alcalá de Henares",
    vehicle_count: 10,
    province_id: 28,
  },
  {
    id: 2,
    slug: "mostoles",
    name: "Móstoles",
    vehicle_count: 20,
    province_id: 28,
  },
];

describe("location-selection", () => {
  it("detecta selección completa de municipios", () => {
    expect(
      isFullProvinceMunicipalitySelection(
        ["alcala-de-henares", "mostoles"],
        madrid_municipalities,
      ),
    ).toBe(true);
    expect(
      isFullProvinceMunicipalitySelection(["alcala-de-henares"], madrid_municipalities),
    ).toBe(false);
  });

  it("normaliza todos los municipios a provincia", () => {
    const selected: LocationSelectedItem[] = [
      {
        value: true,
        type: "municipality",
        slug: "alcala-de-henares",
        province_id: 28,
      },
      {
        value: true,
        type: "municipality",
        slug: "mostoles",
        province_id: 28,
      },
    ];

    expect(
      normalizeSelectedItemsForProvince(
        selected,
        madrid_province,
        madrid_municipalities,
      ),
    ).toEqual([
      { value: true, type: "province", slug: "madrid", province_id: 28 },
    ]);
  });

  it("construye payload de URL", () => {
    expect(
      buildLocationUrlPayload([
        { value: true, type: "province", slug: "madrid", province_id: 28 },
        {
          value: true,
          type: "municipality",
          slug: "mostoles",
          province_id: 28,
        },
      ]),
    ).toEqual({
      [PROVINCE_KEY]: ["madrid"],
      [MUNICIPALITY_KEY]: ["mostoles"],
    });
  });
});
