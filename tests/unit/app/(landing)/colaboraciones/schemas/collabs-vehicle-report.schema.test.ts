import { describe, expect, it } from "vitest";

import { buildCollabsVehicleReportQuerySchema } from "@/app/(landing)/colaboraciones/schemas/collabs-vehicle-report.schema";

describe("buildCollabsVehicleReportQuerySchema", () => {
  it("acepta matrícula válida", () => {
    const result = buildCollabsVehicleReportQuerySchema("plate").safeParse({
      query: "1234 BCD",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza matrícula inválida", () => {
    const result = buildCollabsVehicleReportQuerySchema("plate").safeParse({
      query: "XXXX",
    });

    expect(result.success).toBe(false);
  });

  it("acepta VIN de 17 caracteres válido", () => {
    const result = buildCollabsVehicleReportQuerySchema("vin").safeParse({
      query: "WVWZZZ3CZWE123456",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza VIN corto o con I, O o Q", () => {
    expect(
      buildCollabsVehicleReportQuerySchema("vin").safeParse({
        query: "WVWZZZ3CZWE12345",
      }).success,
    ).toBe(false);

    expect(
      buildCollabsVehicleReportQuerySchema("vin").safeParse({
        query: "WVWZZZ3CZWE12345I",
      }).success,
    ).toBe(false);
  });
});
