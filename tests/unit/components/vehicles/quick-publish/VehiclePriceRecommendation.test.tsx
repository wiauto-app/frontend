import { describe, expect, it } from "vitest";
import {
  buildVehiclePriceRangeLabel,
  buildVehiclePriceSampleLabel,
  buildVehiclePriceSourceLabel,
  formatVehiclePriceEur,
} from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";

describe("VehiclePriceRecommendation helpers", () => {
  it("formatea importes en EUR con locale es-ES", () => {
    expect(formatVehiclePriceEur(24800)).toMatch(/24\.800\s*€|24\.800\s*EUR/i);
    expect(formatVehiclePriceEur(28000)).toMatch(/28\.000\s*€|28\.000\s*EUR/i);
  });

  it("construye la etiqueta del rango de precios", () => {
    const label = buildVehiclePriceRangeLabel(24800, 28000);
    expect(label).toContain("-");
    expect(label).toMatch(/24\.800/);
    expect(label).toMatch(/28\.000/);
  });

  it("construye el texto de muestra con el número de comparables", () => {
    expect(buildVehiclePriceSampleLabel(47)).toBe(
      "Basado en 47 vehículos similares en tu zona (España)",
    );
  });

  it("construye el texto de fuente para estimación de IA", () => {
    expect(buildVehiclePriceSourceLabel("ai", 0)).toContain(
      "Estimación basada en el mercado español (IA)",
    );
  });
});
