import { describe, expect, it } from "vitest";

import {
  FEATURE_CATEGORY_LABELS,
  FEATURE_CATEGORY_ORDER,
  filterFeatureGroupsByQuery,
  formatSelectedCountLabel,
  groupFeaturesByCategory,
} from "@/components/vehicles/utils/groupFeaturesByCategory";

const buildFeature = (name: string, category: string) => ({
  name,
  category,
});

describe("groupFeaturesByCategory", () => {
  it("agrupa en el orden fijo y oculta Otros", () => {
    const groups = groupFeaturesByCategory([
      buildFeature("Android Auto", "multimedia_conectividad"),
      buildFeature("ABS", "seguridad_asistentes"),
      buildFeature("Legacy", "otros"),
      buildFeature("Desconocida", "categoria_inventada"),
      buildFeature("Faros LED", "iluminacion_exterior"),
    ]);

    expect(groups.map((group) => group.slug)).toEqual([
      "seguridad_asistentes",
      "multimedia_conectividad",
      "iluminacion_exterior",
    ]);
    expect(groups.map((group) => group.label)).toEqual([
      FEATURE_CATEGORY_LABELS.seguridad_asistentes,
      FEATURE_CATEGORY_LABELS.multimedia_conectividad,
      FEATURE_CATEGORY_LABELS.iluminacion_exterior,
    ]);
    expect(groups.some((group) => group.slug === "otros")).toBe(false);
    expect(FEATURE_CATEGORY_ORDER).toHaveLength(8);
  });

  it("filtra por nombre dentro de cada categoría", () => {
    const groups = groupFeaturesByCategory([
      buildFeature("Cámara trasera", "aparcamiento"),
      buildFeature("Sensores delanteros", "aparcamiento"),
      buildFeature("Climatizador", "confort"),
    ]);

    const filtered = filterFeatureGroupsByQuery(groups, "cámara");

    expect(filtered).toHaveLength(1);
    expect(filtered[0].slug).toBe("aparcamiento");
    expect(filtered[0].features.map((feature) => feature.name)).toEqual([
      "Cámara trasera",
    ]);
  });
});

describe("formatSelectedCountLabel", () => {
  it("usa singular y plural en castellano de España", () => {
    expect(formatSelectedCountLabel(1)).toBe("1 seleccionado");
    expect(formatSelectedCountLabel(3)).toBe("3 seleccionados");
  });
});
