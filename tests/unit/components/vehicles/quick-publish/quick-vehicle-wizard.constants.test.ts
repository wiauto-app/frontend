import { describe, expect, it } from "vitest";

import {
  findQuickVehicleErrorStep,
  QUICK_VEHICLE_INTRO_STEPS,
} from "@/components/vehicles/quick-publish/quick-vehicle-wizard.constants";

describe("findQuickVehicleErrorStep", () => {
  it("returns the earliest step containing an invalid field", () => {
    const step = findQuickVehicleErrorStep({
      vehicle_type_id: { message: "Selecciona un tipo" },
      email: { message: "Email inválido" },
    });

    expect(step?.id).toBe(1);
  });

  it("maps identification and finance errors to their steps", () => {
    expect(
      findQuickVehicleErrorStep({ vin_code: { message: "VIN inválido" } })?.id,
    ).toBe(2);
    expect(
      findQuickVehicleErrorStep({
        finance_price: { message: "Precio inválido" },
      })?.id,
    ).toBe(4);
  });

  it("only searches through the available steps", () => {
    const availableSteps = QUICK_VEHICLE_INTRO_STEPS.filter(
      step => step.id !== 4,
    );

    expect(
      findQuickVehicleErrorStep(
        { finance_price: { message: "Precio inválido" } },
        availableSteps,
      ),
    ).toBeNull();
  });
});
