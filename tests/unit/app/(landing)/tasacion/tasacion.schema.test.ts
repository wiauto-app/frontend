import { describe, expect, it } from "vitest";

import {
  buildTasacionPayload,
  createTasacionDefaultValues,
  tasacionSchema,
} from "@/app/(landing)/tasacion/schemas/tasacion.schema";

const validPayload = {
  catalog_make_id: 1,
  catalog_model_id: 2,
  catalog_body_type_id: 3,
  catalog_fuel_type_id: 4,
  catalog_year_id: 5,
  version_id: 6,
  transmission_type: "manual" as const,
  mileage: 45000,
  postal_code: "28001",
};

describe("tasacionSchema", () => {
  it("rechaza envío sin version_id o IDs de catálogo", () => {
    const defaults = createTasacionDefaultValues();
    const result = tasacionSchema.safeParse(defaults);

    expect(result.success).toBe(false);
  });

  it("rechaza version_id sin IDs de catálogo completos", () => {
    const result = tasacionSchema.safeParse({
      ...createTasacionDefaultValues(),
      version_id: 10,
    });

    expect(result.success).toBe(false);
  });

  it("acepta payload válido con IDs numéricos", () => {
    const result = tasacionSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it("valida mileage >= 0", () => {
    const negativeMileage = tasacionSchema.safeParse({
      ...validPayload,
      mileage: -1,
    });

    expect(negativeMileage.success).toBe(false);

    const zeroMileage = tasacionSchema.safeParse({
      ...validPayload,
      mileage: 0,
    });

    expect(zeroMileage.success).toBe(true);
  });

  it("valida postal_code mínimo y máximo", () => {
    const tooShort = tasacionSchema.safeParse({
      ...validPayload,
      postal_code: "123",
    });

    expect(tooShort.success).toBe(false);

    const valid = tasacionSchema.safeParse({
      ...validPayload,
      postal_code: "1234",
    });

    expect(valid.success).toBe(true);

    const tooLong = tasacionSchema.safeParse({
      ...validPayload,
      postal_code: "12345678901",
    });

    expect(tooLong.success).toBe(false);
  });

  it("buildTasacionPayload devuelve el mismo shape tipado", () => {
    const parsed = tasacionSchema.parse(validPayload);
    const payload = buildTasacionPayload(parsed);

    expect(payload).toEqual(validPayload);
  });
});
