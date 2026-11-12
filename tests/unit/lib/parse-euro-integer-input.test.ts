import { describe, expect, it } from "vitest";

import { parseEuroIntegerInput } from "@/lib/parse-euro-integer-input";

describe("parseEuroIntegerInput", () => {
  it("interpreta separador de miles español", () => {
    expect(parseEuroIntegerInput("12.500")).toBe(12_500);
    expect(parseEuroIntegerInput("4.400")).toBe(4_400);
  });

  it("mantiene enteros sin separador", () => {
    expect(parseEuroIntegerInput("12500")).toBe(12_500);
    expect(parseEuroIntegerInput(4400)).toBe(4400);
  });

  it("redondea decimales reales", () => {
    expect(parseEuroIntegerInput("12,5")).toBe(13);
  });
});
