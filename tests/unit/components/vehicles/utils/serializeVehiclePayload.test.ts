import { describe, expect, it } from "vitest";

import { createQuickVehicleDefaultValues } from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  is_temp_storage_path,
  serializeVehiclePayload,
} from "@/components/vehicles/utils/serializeVehiclePayload";

const validUuid = "550e8400-e29b-41d4-a716-446655440000";
const validTractionId = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const baseFormValues = {
  ...createQuickVehicleDefaultValues,
  vehicle_type_id: validUuid,
  version_id: 42,
  price: 15_000,
  mileage: 50_000,
  description: "Descripción de prueba con más de diez caracteres.",
  traction_id: validTractionId,
  power: 120,
  displacement: 1600,
  phone: { phone_code: "+34", phone: "612345678" },
  email: "test@example.com",
  catalog_make_id: 1,
  catalog_model_id: 2,
  catalog_year_id: 3,
  catalog_body_type_id: 4,
  catalog_fuel_type_id: 5,
  images: [
    { path: "temp/a.jpg", order: 0, upload_id: "upload-1" },
    { path: "vehicles/b.jpg", order: 1, id: "img-existing" },
    { path: "temp/c.jpg", order: 2 },
  ],
};

describe("is_temp_storage_path", () => {
  it("detecta rutas temporales del storage", () => {
    expect(is_temp_storage_path("temp/a.jpg")).toBe(true);
    expect(is_temp_storage_path("/temp/a.jpg")).toBe(true);
    expect(is_temp_storage_path("vehicles/a.jpg")).toBe(false);
    expect(is_temp_storage_path("")).toBe(false);
  });
});

describe("serializeVehiclePayload", () => {
  it("aplana el teléfono y elimina campos de catálogo del formulario", () => {
    const payload = serializeVehiclePayload(baseFormValues);

    expect(payload.phone_code).toBe("+34");
    expect(payload.phone).toBe("612345678");
    expect(payload).not.toHaveProperty("catalog_make_id");
    expect(payload).not.toHaveProperty("catalog_model_id");
    expect(payload).not.toHaveProperty("catalog_year_id");
    expect(payload).not.toHaveProperty("catalog_body_type_id");
    expect(payload).not.toHaveProperty("catalog_fuel_type_id");
  });

  it("omite ref vacío y recorta ref con espacios", () => {
    const emptyRef = serializeVehiclePayload({
      ...baseFormValues,
      ref: "   ",
    });
    expect(emptyRef).not.toHaveProperty("ref");

    const trimmedRef = serializeVehiclePayload({
      ...baseFormValues,
      ref: "  ABC-123  ",
    });
    expect(trimmedRef.ref).toBe("ABC-123");
  });

  it("serializa imágenes con upload_id o path/id para create", () => {
    const payload = serializeVehiclePayload(baseFormValues);

    expect(payload.images).toEqual([
      { upload_id: "upload-1", order: 0 },
      { id: "img-existing", path: "vehicles/b.jpg", order: 1 },
      { path: "temp/c.jpg", order: 2 },
    ]);
  });

  it("con only_temp_images solo envía rutas temp", () => {
    const payload = serializeVehiclePayload(baseFormValues, {
      only_temp_images: true,
    });

    expect(payload.images).toEqual([
      { upload_id: "upload-1", order: 0 },
      { path: "temp/c.jpg", order: 2 },
    ]);
  });

  it("incluye vehicle_price_id solo en update cuando existe", () => {
    const createPayload = serializeVehiclePayload({
      ...baseFormValues,
      vehicle_price_id: "price-1",
    });
    expect(createPayload).not.toHaveProperty("vehicle_price_id");

    const updatePayload = serializeVehiclePayload(
      {
        ...baseFormValues,
        vehicle_price_id: "price-1",
      },
      { is_update: true },
    );
    expect(updatePayload.vehicle_price_id).toBe("price-1");
  });

  it("no envía videos al API aunque vengan en el formulario", () => {
    const payload = serializeVehiclePayload({
      ...baseFormValues,
      videos: [{ path: "temp/clip.mp4", order: 0 }],
    });

    expect(payload).not.toHaveProperty("videos");
  });
});
