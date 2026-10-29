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
  lat: 40.4168,
  lng: -3.7038,
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

  it("acepta una sola fotografía y rechaza el envío sin fotos", () => {
    const withOneImage = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      images: [{ path: "temp/a.jpg", order: 0 }],
    });
    expect(withOneImage.success).toBe(true);

    const withoutImages = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      images: [],
    });
    expect(withoutImages.success).toBe(false);
    if (!withoutImages.success) {
      expect(withoutImages.error.issues[0]?.message).toBe(
        "Sube al menos una fotografía del vehículo.",
      );
    }
  });

  it("exige km y precio en español y no convierte el vacío en 0", () => {
    const emptyPrice = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      price: "",
    });
    expect(emptyPrice.success).toBe(false);
    if (!emptyPrice.success) {
      expect(emptyPrice.error.issues[0]?.message).toBe("Introduce el precio.");
      expect(emptyPrice.error.issues[0]?.message).not.toMatch(/Too small/i);
    }

    const emptyMileage = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      mileage: "",
    });
    expect(emptyMileage.success).toBe(false);
    if (!emptyMileage.success) {
      expect(emptyMileage.error.issues[0]?.message).toBe(
        "Introduce el kilometraje.",
      );
    }
  });

  it("permite publicar sin tracción ni potencia", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      traction_id: "",
      power: undefined,
    });

    expect(result.success).toBe(true);
  });

  it("no exige ficha eléctrica para publicar", () => {
    const withoutElectric = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      catalog_fuel_can_charge: true,
    });

    expect(withoutElectric.success).toBe(true);
  });

  it("permite matrícula y VIN vacíos", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      license_plate: "",
      vin_code: "",
    });

    expect(result.success).toBe(true);
  });

  it("acepta matrícula en formato 1234ABC", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      license_plate: "1234ABC",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.license_plate).toBe("1234ABC");
    }
  });

  it("normaliza matrícula con espacios y minúsculas", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      license_plate: "1234 abc",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.license_plate).toBe("1234ABC");
    }
  });

  it("rechaza matrícula con formato inválido", () => {
    const result = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      license_plate: "ABC1234",
    });

    expect(result.success).toBe(false);
  });

  it("valida description como string opcional sin mínimo pero con máximo de 3000", () => {
    const shortDescription = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      description: "corta",
    });
    expect(shortDescription.success).toBe(true);

    const emptyDescription = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      description: "",
    });
    expect(emptyDescription.success).toBe(true);

    const maxDescription = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      description: "a".repeat(3000),
    });
    expect(maxDescription.success).toBe(true);

    const tooLongDescription = quickVehicleSchema.safeParse({
      ...baseValidPayload,
      description: "a".repeat(5000),
    });
    expect(tooLongDescription.success).toBe(false);
  });
});