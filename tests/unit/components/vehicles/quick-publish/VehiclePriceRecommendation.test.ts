import { describe, expect, it } from "vitest";
import type { RecommendVehiclePriceResponse } from "@/components/vehicles/services/vehicleAiService";
import {
  buildVehiclePriceRangeLabel,
  buildVehiclePriceSampleLabel,
  buildVehiclePriceSourceLabel,
  formatVehiclePriceEur,
  resolveVehiclePriceRecommendationStatus,
} from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";

const buildRecommendation = (
  overrides: Partial<RecommendVehiclePriceResponse> = {},
): RecommendVehiclePriceResponse => ({
  recommended_price: 18500,
  range_min: 17000,
  range_max: 20000,
  sample_count: 12,
  explanation: "Precio alineado con el mercado local.",
  confidence: "high",
  source: "platform",
  ...overrides,
});

describe("formatVehiclePriceEur", () => {
  it("formatea importes en EUR con locale es-ES", () => {
    expect(formatVehiclePriceEur(18500)).toMatch(/18\.500\s*€|18\.500\s*EUR/u);
  });
});

describe("buildVehiclePriceRangeLabel", () => {
  it("une el rango mínimo y máximo formateados", () => {
    expect(buildVehiclePriceRangeLabel(17000, 20000)).toContain("-");
    expect(buildVehiclePriceRangeLabel(17000, 20000)).toContain("17.000");
    expect(buildVehiclePriceRangeLabel(17000, 20000)).toContain("20.000");
  });
});

describe("buildVehiclePriceSampleLabel", () => {
  it("describe la muestra usada para la recomendación", () => {
    expect(buildVehiclePriceSampleLabel(8)).toBe(
      "Basado en 8 vehículos similares en tu zona (España)",
    );
  });
});

describe("buildVehiclePriceSourceLabel", () => {
  it("usa el copy de plataforma cuando source es platform", () => {
    expect(buildVehiclePriceSourceLabel("platform", 8)).toBe(
      "Basado en 8 vehículos similares en tu zona (España)",
    );
  });

  it("usa el copy de IA cuando source es ai", () => {
    expect(buildVehiclePriceSourceLabel("ai", 0)).toBe(
      "Estimación basada en el mercado español (IA). A medida que haya más anuncios similares en WiAuto, usaremos datos reales de la plataforma.",
    );
  });
});

describe("resolveVehiclePriceRecommendationStatus", () => {
  it("devuelve rate_limited cuando el hook reporta límite", () => {
    expect(
      resolveVehiclePriceRecommendationStatus(null, "rate_limited"),
    ).toBe("rate_limited");
  });

  it("devuelve idle cuando no hay datos ni error relevante", () => {
    expect(resolveVehiclePriceRecommendationStatus(null, null)).toBe("idle");
    expect(resolveVehiclePriceRecommendationStatus(null, "generic")).toBe(
      "idle",
    );
  });

  it("devuelve success con datos de plataforma", () => {
    const data = buildRecommendation({
      source: "platform",
      confidence: "high",
      sample_count: 10,
    });

    expect(resolveVehiclePriceRecommendationStatus(data, null)).toBe("success");
  });

  it("devuelve success con estimación de IA", () => {
    const data = buildRecommendation({
      source: "ai",
      confidence: "low",
      sample_count: 0,
    });

    expect(resolveVehiclePriceRecommendationStatus(data, null)).toBe("success");
  });
});
