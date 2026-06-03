import { describe, expect, it } from "vitest";

import {
  buildMakeModelUrlPayload,
  getModelsForMake,
  isFullMakeModelSelection,
  normalizeSelectedItemsForMake,
} from "@/components/selectors/FilterMakeSelector/utils/make-model-selection";
import {
  MAKE_KEY,
  MODEL_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import type { SelectedItem } from "@/components/selectors/FilterMakeSelector/interfaces/makeSelector.interface";

const toyota_make: HeroCatalogFacetItem = {
  id: 114,
  slug: "toyota",
  name: "TOYOTA",
  vehicle_count: 2,
};

const toyota_models: HeroCatalogFacetItem[] = [
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

const facet_models: HeroCatalogFacetItem[] = [
  ...toyota_models,
  {
    id: 20,
    slug: "serie-3",
    name: "Serie 3",
    vehicle_count: 3,
    make_id: 2,
  },
];

describe("getModelsForMake", () => {
  it("filtra modelos por make_id", () => {
    expect(getModelsForMake(facet_models, 114)).toEqual(toyota_models);
  });
});

describe("isFullMakeModelSelection", () => {
  it("devuelve true cuando los slugs coinciden con todos los modelos disponibles", () => {
    expect(
      isFullMakeModelSelection(
        ["corolla", "land-cruiser"],
        toyota_models,
      ),
    ).toBe(true);
  });

  it("devuelve false con selección parcial", () => {
    expect(isFullMakeModelSelection(["corolla"], toyota_models)).toBe(false);
  });

  it("devuelve false sin modelos disponibles en facetas", () => {
    expect(isFullMakeModelSelection(["corolla"], [])).toBe(false);
  });
});

describe("normalizeSelectedItemsForMake", () => {
  it("promueve dos modelos a un solo type make", () => {
    const selected: SelectedItem[] = [
      {
        value: true,
        type: "model",
        slug: "corolla",
        make_id: 114,
      },
      {
        value: true,
        type: "model",
        slug: "land-cruiser",
        make_id: 114,
      },
    ];

    expect(
      normalizeSelectedItemsForMake(selected, toyota_make, toyota_models),
    ).toEqual([
      { value: true, type: "make", slug: "toyota", make_id: 114 },
    ]);
  });

  it("mantiene solo modelos con selección parcial", () => {
    const selected: SelectedItem[] = [
      { value: true, type: "make", slug: "toyota", make_id: 114 },
      {
        value: true,
        type: "model",
        slug: "corolla",
        make_id: 114,
      },
    ];

    expect(
      normalizeSelectedItemsForMake(selected, toyota_make, toyota_models),
    ).toEqual([
      {
        value: true,
        type: "model",
        slug: "corolla",
        make_id: 114,
      },
    ]);
  });

  it("degrada make a modelos cuando se desmarca un modelo de marca completa", () => {
    const selected: SelectedItem[] = [
      { value: true, type: "make", slug: "toyota", make_id: 114 },
    ];

    const with_corolla: SelectedItem[] = [
      {
        value: true,
        type: "model",
        slug: "corolla",
        make_id: 114,
      },
      {
        value: true,
        type: "model",
        slug: "land-cruiser",
        make_id: 114,
      },
    ];

    const partial = with_corolla.filter(
      (item) => item.slug !== "land-cruiser",
    );

    expect(
      normalizeSelectedItemsForMake(partial, toyota_make, toyota_models),
    ).toEqual([
      {
        value: true,
        type: "model",
        slug: "corolla",
        make_id: 114,
      },
    ]);
  });

  it("no altera entradas de otras marcas", () => {
    const selected: SelectedItem[] = [
      { value: true, type: "make", slug: "audi", make_id: 1 },
      {
        value: true,
        type: "model",
        slug: "corolla",
        make_id: 114,
      },
    ];

    expect(
      normalizeSelectedItemsForMake(selected, toyota_make, toyota_models),
    ).toEqual([
      { value: true, type: "make", slug: "audi", make_id: 1 },
      {
        value: true,
        type: "model",
        slug: "corolla",
        make_id: 114,
      },
    ]);
  });
});

describe("buildMakeModelUrlPayload", () => {
  it("devuelve marcas y modelos según selectedItems", () => {
    const payload = buildMakeModelUrlPayload([
      { value: true, type: "make", slug: "toyota", make_id: 114 },
      { value: true, type: "model", slug: "serie-3", make_id: 2 },
    ]);

    expect(payload).toEqual({
      [MAKE_KEY]: ["toyota"],
      [MODEL_KEY]: ["serie-3"],
    });
  });

  it("omite claves vacías", () => {
    expect(
      buildMakeModelUrlPayload([
        { value: true, type: "make", slug: "toyota", make_id: 114 },
      ]),
    ).toEqual({
      [MAKE_KEY]: ["toyota"],
      [MODEL_KEY]: undefined,
    });
  });
});
