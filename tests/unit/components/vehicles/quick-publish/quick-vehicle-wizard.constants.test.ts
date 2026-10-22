import { describe, expect, it } from "vitest";

import {
  findFirstQuickVehicleErrorField,
  findQuickVehicleErrorStep,
  getQuickPublishStepMotivation,
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
    ).toBe(3);
  });

  it("findFirstQuickVehicleErrorField returns the earliest invalid field", () => {
    const match = findFirstQuickVehicleErrorField({
      vehicle_type_id: { message: "Selecciona un tipo" },
      traction_id: { message: "Selecciona tracción" },
    });

    expect(match?.field).toBe("vehicle_type_id");
    expect(match?.step.id).toBe(1);
  });

  it("getQuickPublishStepMotivation adapts to step position", () => {
    expect(getQuickPublishStepMotivation(0, 3)).toContain("tipo de vehículo");
    expect(getQuickPublishStepMotivation(1, 3)).toContain("casi listo");
    expect(getQuickPublishStepMotivation(2, 3)).toContain("Último paso");
  });

  it("only searches through the available steps", () => {
    const availableSteps = QUICK_VEHICLE_INTRO_STEPS.filter(
      step => step.id !== 3,
    );

    expect(
      findQuickVehicleErrorStep(
        { finance_price: { message: "Precio inválido" } },
        availableSteps,
      ),
    ).toBeNull();
  });
});
