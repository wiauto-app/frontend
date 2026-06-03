import { describe, expect, it } from "vitest";

import {
  buildMakeSelectorSyncSignature,
  syncMakeSelectorFromActiveFilters,
} from "@/components/selectors/FilterMakeSelector/utils/syncFromActiveFilters";
import type { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";

const facet_makes: HeroCatalogFacetItem[] = [
  { id: 1, slug: "audi", name: "Audi", vehicle_count: 10 },
  { id: 2, slug: "bmw", name: "BMW", vehicle_count: 5 },
];

const active_filters: ActiveFiltersResponse = {
  resolved: {
    vehicle_type: null,
    makes: [{ id: 1, slug: "audi", name: "Audi" }],
    models: [
      { id: 20, slug: "serie-3", name: "Serie 3", make_id: 2, model_id: 200 },
    ],
    provinces: [],
    communities: [],
    municipalities: [],
    services: [],
    warranties: [],
    colors: [],
    dgt_labels: [],
    features: [],
    fuels: [],
    tractions: [],
    cuotas: [],
  },
  applied: {},
};

const empty_resolved_lists = {
  provinces: [],
  communities: [],
  municipalities: [],
  services: [],
  warranties: [],
  colors: [],
  dgt_labels: [],
  features: [],
  fuels: [],
  tractions: [],
  cuotas: [],
} as const;

describe("syncMakeSelectorFromActiveFilters", () => {
  it("con modelos concretos no marca type make de esa marca", () => {
    const { selected_items } = syncMakeSelectorFromActiveFilters(
      active_filters,
      facet_makes,
    );

    expect(selected_items).toEqual([
      { value: true, type: "make", slug: "audi", make_id: 1 },
      { value: true, type: "model", slug: "serie-3", make_id: 2 },
    ]);
  });

  it("si hay modelos parciales de una marca no añade type make para esa marca", () => {
    const toyota_only_model: ActiveFiltersResponse = {
      resolved: {
        vehicle_type: null,
        makes: [{ id: 114, slug: "toyota", name: "TOYOTA" }],
        models: [
          {
            id: 1406,
            slug: "corolla",
            name: "Corolla",
            make_id: 114,
            model_id: 272,
          },
        ],
        ...empty_resolved_lists,
      },
      applied: {},
    };

    const facet = [
      { id: 114, slug: "toyota", name: "TOYOTA", vehicle_count: 2 },
    ];

    const facet_models: HeroCatalogFacetItem[] = [
      {
        id: 1406,
        slug: "corolla",
        name: "Corolla",
        vehicle_count: 1,
        make_id: 114,
      },
      {
        id: 1407,
        slug: "land-cruiser",
        name: "Land Cruiser",
        vehicle_count: 1,
        make_id: 114,
      },
    ];

    const { selected_items } = syncMakeSelectorFromActiveFilters(
      toyota_only_model,
      facet,
      facet_models,
    );

    expect(selected_items).toEqual([
      { value: true, type: "model", slug: "corolla", make_id: 114 },
    ]);
  });

  it("si todos los modelos de facetas están activos normaliza a type make", () => {
    const toyota_full: ActiveFiltersResponse = {
      resolved: {
        vehicle_type: null,
        makes: [{ id: 114, slug: "toyota", name: "TOYOTA" }],
        models: [
          {
            id: 1406,
            slug: "corolla",
            name: "Corolla",
            make_id: 114,
            model_id: 272,
          },
          {
            id: 1407,
            slug: "land-cruiser",
            name: "Land Cruiser",
            make_id: 114,
            model_id: 273,
          },
        ],
        ...empty_resolved_lists,
      },
      applied: {},
    };

    const facet = [
      { id: 114, slug: "toyota", name: "TOYOTA", vehicle_count: 2 },
    ];

    const facet_models: HeroCatalogFacetItem[] = [
      {
        id: 1406,
        slug: "corolla",
        name: "Corolla",
        vehicle_count: 1,
        make_id: 114,
      },
      {
        id: 1407,
        slug: "land-cruiser",
        name: "Land Cruiser",
        vehicle_count: 1,
        make_id: 114,
      },
    ];

    const { selected_items } = syncMakeSelectorFromActiveFilters(
      toyota_full,
      facet,
      facet_models,
    );

    expect(selected_items).toEqual([
      { value: true, type: "make", slug: "toyota", make_id: 114 },
    ]);
  });

  it("expande marcas activas y marcas con modelos activos", () => {
    const { expanded_makes } = syncMakeSelectorFromActiveFilters(
      active_filters,
      facet_makes,
    );

    expect(expanded_makes.map((make) => make.slug).sort()).toEqual([
      "audi",
      "bmw",
    ]);
  });

  it("buildMakeSelectorSyncSignature cambia al variar slugs", () => {
    expect(buildMakeSelectorSyncSignature(active_filters)).toBe("audi|serie-3");
    expect(buildMakeSelectorSyncSignature(null)).toBeNull();
  });
});
