import { describe, expect, it } from "vitest";

import { isValidSpanishDniOrNie } from "@/app/(landing)/seguros/schemas/spanish-dni.schema";
import { segurosLeadSchema } from "@/app/(landing)/seguros/schemas/seguros-lead.schema";

describe("isValidSpanishDniOrNie", () => {
  it("acepta un DNI válido", () => {
    expect(isValidSpanishDniOrNie("12345678Z")).toBe(true);
  });

  it("rechaza un DNI con letra incorrecta", () => {
    expect(isValidSpanishDniOrNie("12345678A")).toBe(false);
  });

  it("acepta un NIE válido", () => {
    expect(isValidSpanishDniOrNie("X1234567L")).toBe(true);
  });
});

describe("segurosLeadSchema", () => {
  const validPayload = {
    firstName: "Ana",
    lastName: "García López",
    dni: "12345678Z",
    phone: "612345678",
    email: "ana@ejemplo.com",
    licensePlate: "",
    catalog_make_id: 1,
    catalog_model_id: 10,
  };

  it("acepta un payload mínimo válido", () => {
    const result = segurosLeadSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("exige marca y modelo", () => {
    const result = segurosLeadSchema.safeParse({
      ...validPayload,
      catalog_make_id: undefined,
      catalog_model_id: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("permite matrícula vacía y versión sin informar", () => {
    const result = segurosLeadSchema.safeParse({
      ...validPayload,
      licensePlate: "   ",
    });
    expect(result.success).toBe(true);
  });

  it("valida matrícula si se informa", () => {
    const ok = segurosLeadSchema.safeParse({
      ...validPayload,
      licensePlate: "1234BCD",
    });
    expect(ok.success).toBe(true);

    const bad = segurosLeadSchema.safeParse({
      ...validPayload,
      licensePlate: "XXXX",
    });
    expect(bad.success).toBe(false);
  });
});
