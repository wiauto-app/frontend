import { describe, expect, it } from "vitest";
import {
  createQuickVehicleDefaultValues,
  quickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";

const validUuid = "550e8400-e29b-41d4-a716-446655440000";
const validTractionId = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const baseValidPayload = {
  ...createQuickVehicleDefaultValues,
  vehicle_type_id: validUuid,
  images: [
    { path: "temp/a.jpg", order: 0 },
    { path: "temp/b.jpg", order: 1 },
    { path: "temp/c.jpg", order: 2 },
  ],
  version_id: 1,
  price: 15000,
  mileage: 50000,
  description: "Descripción de prueba con más de diez caracteres.",
  traction_id: validTractionId,
  power: 120,
  displacement: 1600,
  phone: { phone_code: "+34", phone: "612345678" },
  email: "test@example.com",
};

describe("quickVehicleSchema", () => {
  it("rechaza envío sin vehicle_type_id", () => {
    const result = quickVehicleSchema.safeParse(createQuickVehicleDefaultValues);
    expect(result.success).toBe(false);
  });

  it("acepta payload válido sin campos eléctricos cuando no es recargable", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      catalog_fuel_can_charge: false,
    });

    expect(result.success).toBe(true);
  });

  it("exige campos eléctricos cuando catalog_fuel_can_charge es true", () => {
    const withoutElectric = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      catalog_fuel_can_charge: true,
    });

    expect(withoutElectric.success).toBe(false);

    const withElectric = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      catalog_fuel_can_charge: true,
      autonomy: 400,
      battery_capacity: 75,
      time_to_charge: 8,
    });

    expect(withElectric.success).toBe(true);
  });

  it("rechaza campos eléctricos con valor cero cuando es recargable", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      catalog_fuel_can_charge: true,
      autonomy: 0,
      battery_capacity: 50,
      time_to_charge: 4,
    });

    expect(result.success).toBe(false);
  });

  it("permite matrícula y VIN vacíos", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      license_plate: "",
      vin_code: "",
    });

    expect(result.success).toBe(true);
  });

  it("valida description solo con min(10) y sin max", () => {
    const shortDescription = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      description: "corta",
    });
    expect(shortDescription.success).toBe(false);

    const longDescription = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      description: "a".repeat(5000),
    });
    expect(longDescription.success).toBe(true);
  });
});
