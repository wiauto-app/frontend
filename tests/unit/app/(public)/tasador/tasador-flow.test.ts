import { describe, expect, it } from "vitest";

import { TASADOR_DEFAULT } from "@/app/(public)/tasador/content/tasador.fallback";
import { createTasadorSchema } from "@/app/(public)/tasador/schemas/tasador.schema";
import { toEstimatePayload } from "@/app/(public)/tasador/utils/tasadorPending";
import {
  createQuickVehicleDefaultValues,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import { mapAppraisalToQuickFormValues } from "@/components/vehicles/utils/mapAppraisalToQuickFormValues";
import type { AppraisalDetail } from "@/services/appraisal/types/appraisal.types";

const VALID_INPUT = {
  catalog_make_id: 1,
  catalog_model_id: 2,
  catalog_year_id: 3,
  version_id: 4,
  fuel_type_id: 5,
  transmission_type: "manual",
  mileage: "92000",
  power: "",
  plate: "",
  name: "Ana",
  last_name: "",
  email: "ana@example.com",
  phone: { phone_code: "+34", phone: "612345678" },
};

describe("createTasadorSchema", () => {
  const schema = createTasadorSchema(TASADOR_DEFAULT.formulario);

  it("acepta un formulario válido y deja vacíos los opcionales", () => {
    const result = schema.parse(VALID_INPUT);

    expect(result.mileage).toBe(92_000);
    expect(result.power).toBeUndefined();
    expect(result.plate).toBeUndefined();
  });

  it("usa los mensajes de Strapi cuando falta el catálogo", () => {
    const result = schema.safeParse({ ...VALID_INPUT, catalog_make_id: 0, version_id: 0 });

    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toContain("Selecciona la marca");
    expect(messages).toContain("Selecciona la versión");
  });

  it("rechaza una matrícula con caracteres no válidos", () => {
    const result = schema.safeParse({ ...VALID_INPUT, plate: "12@34" });

    expect(result.success).toBe(false);
  });
});

describe("toEstimatePayload", () => {
  it("aplana el teléfono y omite apellidos vacíos", () => {
    const values = createTasadorSchema().parse({ ...VALID_INPUT, power: "150" });

    expect(toEstimatePayload(values)).toEqual({
      version_id: 4,
      transmission_type: "manual",
      mileage: 92_000,
      power: 150,
      plate: undefined,
      name: "Ana",
      last_name: undefined,
      email: "ana@example.com",
      phone_code: "+34",
      phone: "612345678",
    });
  });
});

describe("mapAppraisalToQuickFormValues", () => {
  it("prellena catálogo, km, transmisión, potencia y precio recomendado", () => {
    const appraisal = {
      vehicle: {
        make_id: 1,
        model_id: 2,
        year_id: 3,
        version_id: 4,
        fuel_type_id: 5,
        mileage: 92_000,
        transmission_type: "automatic",
        power: 150,
      },
      estimate: { recommended_price: 19_000 },
    } as AppraisalDetail;

    const values = mapAppraisalToQuickFormValues(
      appraisal,
      createQuickVehicleDefaultValues as QuickVehicleSchema,
    );

    expect(values).toMatchObject({
      catalog_make_id: 1,
      catalog_model_id: 2,
      catalog_year_id: 3,
      catalog_fuel_type_id: 5,
      version_id: 4,
      condition: "used",
      mileage: 92_000,
      transmission_type: "automatic",
      power: 150,
      price: 19_000,
    });
  });
});
