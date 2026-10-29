import { describe, expect, it } from "vitest";

import {
  findFirstQuickVehicleErrorField,
  findQuickVehicleErrorStep,
  getQuickPublishStepMotivation,
  QUICK_VEHICLE_INTRO_STEPS,
  QUICK_VEHICLE_STEP_IDS,
} from "@/components/vehicles/quick-publish/quick-vehicle-wizard.constants";

describe("findQuickVehicleErrorStep", () => {
  it("returns the earliest step containing an invalid field", () => {
    const step = findQuickVehicleErrorStep({
      images: { message: "Sube al menos una fotografía del vehículo." },
      email: { message: "Email inválido" },
    });

    expect(step?.id).toBe(QUICK_VEHICLE_STEP_IDS.photos);
  });

  it("maps identification and contact errors to their steps", () => {
    expect(
      findQuickVehicleErrorStep({ vin_code: { message: "VIN inválido" } })?.id,
    ).toBe(QUICK_VEHICLE_STEP_IDS.vehicle);
    expect(
      findQuickVehicleErrorStep({
        email: { message: "Introduce un correo electrónico válido." },
      })?.id,
    ).toBe(QUICK_VEHICLE_STEP_IDS.contact);
  });

  it("findFirstQuickVehicleErrorField returns the earliest invalid field", () => {
    const match = findFirstQuickVehicleErrorField({
      vehicle_type_id: { message: "Selecciona un tipo" },
      traction_id: { message: "Selecciona tracción" },
    });

    expect(match?.field).toBe("vehicle_type_id");
    expect(match?.step.id).toBe(QUICK_VEHICLE_STEP_IDS.vehicle);
  });

  it("getQuickPublishStepMotivation adapts to step position", () => {
    expect(getQuickPublishStepMotivation(0, 3)).toContain("fotografías");
    expect(getQuickPublishStepMotivation(1, 3)).toContain("casi listo");
    expect(getQuickPublishStepMotivation(2, 3)).toContain("Último paso");
  });

  it("alta rápida solo tiene tres pantallas", () => {
    expect(QUICK_VEHICLE_INTRO_STEPS.map((step) => step.id)).toEqual([
      QUICK_VEHICLE_STEP_IDS.photos,
      QUICK_VEHICLE_STEP_IDS.vehicle,
      QUICK_VEHICLE_STEP_IDS.contact,
    ]);
  });

  it("only searches through the available steps", () => {
    const availableSteps = QUICK_VEHICLE_INTRO_STEPS.filter(
      (step) => step.id !== QUICK_VEHICLE_STEP_IDS.contact,
    );

    expect(
      findQuickVehicleErrorStep(
        { email: { message: "Email inválido" } },
        availableSteps,
      ),
    ).toBeNull();
  });
});
