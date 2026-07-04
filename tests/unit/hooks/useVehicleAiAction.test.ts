import { describe, expect, it } from "vitest";
import {
  createQuickVehicleDefaultValues,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import { getVehicleAiCanExecute } from "@/hooks/useVehicleAiAction";

const buildValidFormValues = (): QuickVehicleSchema => ({
  ...createQuickVehicleDefaultValues,
  vehicle_type_id: "550e8400-e29b-41d4-a716-446655440000",
  version_id: 42,
  condition: "used",
  mileage: 85000,
  lat: 40.4168,
  lng: -3.7038,
  transmission_type: "manual",
  power: 110,
  traction_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
});

describe("getVehicleAiCanExecute", () => {
  it("permite recomendar precio con los campos base completos", () => {
    const values = buildValidFormValues();

    expect(getVehicleAiCanExecute("recommendPrice", values)).toBe(true);
  });

  it("no permite recomendar precio sin versión de catálogo", () => {
    const values = buildValidFormValues();
    values.version_id = 0;

    expect(getVehicleAiCanExecute("recommendPrice", values)).toBe(false);
  });

  it("no permite recomendar precio sin ubicación", () => {
    const values = buildValidFormValues();
    values.lat = Number.NaN;

    expect(getVehicleAiCanExecute("recommendPrice", values)).toBe(false);
  });

  it("permite generar descripción cuando la ficha técnica está completa", () => {
    const values = buildValidFormValues();

    expect(getVehicleAiCanExecute("generateDescription", values)).toBe(true);
  });

  it("no permite generar descripción sin potencia ni tracción", () => {
    const values = buildValidFormValues();
    values.power = 0;
    values.traction_id = "";

    expect(getVehicleAiCanExecute("generateDescription", values)).toBe(false);
  });

  it("no permite generar descripción con tracción inválida", () => {
    const values = buildValidFormValues();
    values.traction_id = "no-es-uuid";

    expect(getVehicleAiCanExecute("generateDescription", values)).toBe(false);
  });
});
