import { describe, expect, it } from "vitest";

import { resolveVehicleReportMode } from "@/app/(landing)/colaboraciones/utils/resolveVehicleReportMode";
import type { StrapiLink } from "@/interfaces/strapi-components.interface";

const baseButton = (overrides: Partial<StrapiLink>): StrapiLink => ({
  id: 1,
  label: "Con matrícula",
  url: "",
  destacado: true,
  imagen: null,
  iconName: null,
  ...overrides,
});

describe("resolveVehicleReportMode", () => {
  it("usa url vin o matricula cuando está definida", () => {
    expect(
      resolveVehicleReportMode(baseButton({ url: "vin", label: "Cualquiera" })),
    ).toBe("vin");
    expect(
      resolveVehicleReportMode(
        baseButton({ url: "matricula", label: "Cualquiera" }),
      ),
    ).toBe("plate");
  });

  it("deduce VIN por label si url está vacía", () => {
    expect(
      resolveVehicleReportMode(
        baseButton({ url: "", label: "Con código VIN" }),
      ),
    ).toBe("vin");
  });

  it("devuelve matrícula por defecto", () => {
    expect(
      resolveVehicleReportMode(
        baseButton({ url: "", label: "Con matricula " }),
      ),
    ).toBe("plate");
    expect(resolveVehicleReportMode(null)).toBe("plate");
  });
});
