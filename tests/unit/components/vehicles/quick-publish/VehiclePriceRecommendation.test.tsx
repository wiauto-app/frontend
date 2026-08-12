import { describe, expect, it } from "vitest";
import {
  buildVehiclePriceRangeLabel,
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

});
