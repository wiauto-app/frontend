import { describe, expect, it } from "vitest";

import {
  findFirstQuickVehicleErrorField,
  findQuickVehicleErrorStep,
  getQuickPublishStepMotivation,
  isSubscriberOnlyQuickVehicleStep,
  parseQuickVehicleStep,
  QUICK_VEHICLE_INTRO_STEPS,
  QUICK_VEHICLE_STEP_IDS,
  withDescriptionOnLastStep,
} from "@/components/vehicles/quick-publish/quick-vehicle-wizard.constants";

describe("findQuickVehicleErrorStep", () => {
  it("returns the earliest step containing an invalid field", () => {
    const step = findQuickVehicleErrorStep({
      images: { message: "Sube al menos una fotografía del vehículo." },
      email: { message: "Email inválido" },
    });

    expect(step?.id).toBe(QUICK_VEHICLE_STEP_IDS.data);
  });

  it("maps legacy photos step query to datos step", () => {
    expect(parseQuickVehicleStep(String(QUICK_VEHICLE_STEP_IDS.photos))).toBe(
      QUICK_VEHICLE_STEP_IDS.data,
    );
  });

  it("maps identification and contact errors to the datos step", () => {
    expect(
      findQuickVehicleErrorStep({
        license_plate: { message: "Matrícula inválida" },
      })?.id,
    ).toBe(QUICK_VEHICLE_STEP_IDS.data);
    expect(
      findQuickVehicleErrorStep({
        email: { message: "Introduce un correo electrónico válido." },
      })?.id,
    ).toBe(QUICK_VEHICLE_STEP_IDS.data);
  });

  it("findFirstQuickVehicleErrorField returns the earliest invalid field", () => {
    const match = findFirstQuickVehicleErrorField({
      vehicle_type_id: { message: "Selecciona un tipo" },
      traction_id: { message: "Selecciona tracción" },
    });

    expect(match?.field).toBe("vehicle_type_id");
    expect(match?.step.id).toBe(QUICK_VEHICLE_STEP_IDS.data);
  });

  it("getQuickPublishStepMotivation adapts to step position", () => {
    expect(getQuickPublishStepMotivation(0, 1)).toContain("un solo paso");
    expect(getQuickPublishStepMotivation(0, 3)).toContain("Fotos, datos");
    expect(getQuickPublishStepMotivation(2, 3)).toContain("Último paso");
  });

  it("publicar y edición comparten el mismo recorrido de pasos", () => {
    expect(QUICK_VEHICLE_INTRO_STEPS.map((step) => step.id)).toEqual([
      QUICK_VEHICLE_STEP_IDS.data,
      QUICK_VEHICLE_STEP_IDS.extra,
      QUICK_VEHICLE_STEP_IDS.financing,
    ]);
  });

  it("only searches through the available steps", () => {
    const availableSteps = QUICK_VEHICLE_INTRO_STEPS.filter(
      (step) => step.id !== QUICK_VEHICLE_STEP_IDS.data,
    );

    expect(
      findQuickVehicleErrorStep(
        { email: { message: "Email inválido" } },
        availableSteps,
      ),
    ).toBeNull();
  });

  it("marks details and financing as subscriber-only steps", () => {
    expect(isSubscriberOnlyQuickVehicleStep(QUICK_VEHICLE_STEP_IDS.extra)).toBe(
      true,
    );
    expect(
      isSubscriberOnlyQuickVehicleStep(QUICK_VEHICLE_STEP_IDS.financing),
    ).toBe(true);
    expect(isSubscriberOnlyQuickVehicleStep(QUICK_VEHICLE_STEP_IDS.data)).toBe(
      false,
    );
  });

  it("redirects legacy contact step query to datos step", () => {
    expect(parseQuickVehicleStep(String(QUICK_VEHICLE_STEP_IDS.contact))).toBe(
      QUICK_VEHICLE_STEP_IDS.data,
    );
  });

  it("maps description errors to the financing step in the full flow", () => {
    expect(
      findQuickVehicleErrorStep({
        description: { message: "Descripción demasiado corta" },
      })?.id,
    ).toBe(QUICK_VEHICLE_STEP_IDS.financing);
  });

  it("withDescriptionOnLastStep keeps description only on the last available step", () => {
    const dataOnly = withDescriptionOnLastStep(
      QUICK_VEHICLE_INTRO_STEPS.filter(
        (step) => step.id === QUICK_VEHICLE_STEP_IDS.data,
      ),
    );

    expect(dataOnly[0]?.fields).toContain("description");
    expect(
      findQuickVehicleErrorStep(
        { description: { message: "Revisa la descripción" } },
        dataOnly,
      )?.id,
    ).toBe(QUICK_VEHICLE_STEP_IDS.data);

    const fullFlow = withDescriptionOnLastStep(QUICK_VEHICLE_INTRO_STEPS);
    expect(fullFlow[0]?.fields).not.toContain("description");
    expect(fullFlow.at(-1)?.fields).toContain("description");
    expect(fullFlow.at(-1)?.id).toBe(QUICK_VEHICLE_STEP_IDS.financing);
  });
});
