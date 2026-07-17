"use client";

import { useFormContext } from "react-hook-form";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { Button } from "@/components/ui/button";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  parseDisplacementCc,
  VEHICLE_IDENTIFICATION_GENERIC_ERROR_MESSAGE,
  VEHICLE_IDENTIFICATION_NOT_FOUND_MESSAGE,
  VEHICLE_IDENTIFICATION_RATE_LIMIT_MESSAGE,
  type ApiVehicleResponse,
} from "@/components/vehicles/services/vehicleIdentificationService";
import { QuickVehicleIdentificationPreview } from "./QuickVehicleIdentificationPreview";
import {
  useVehicleIdentificationLookup,
  type VehicleIdentificationLookupError,
  type VehicleIdentificationLookupOutcome,
} from "./hooks/useVehicleIdentificationLookup";

const getLookupErrorMessage = (
  error: VehicleIdentificationLookupError,
): string => {
  if (error === "not_found") {
    return VEHICLE_IDENTIFICATION_NOT_FOUND_MESSAGE;
  }
  if (error === "rate_limited") {
    return VEHICLE_IDENTIFICATION_RATE_LIMIT_MESSAGE;
  }
  return VEHICLE_IDENTIFICATION_GENERIC_ERROR_MESSAGE;
};

const applyIdentificationToForm = (
  setValue: ReturnType<typeof useFormContext<QuickVehicleSchema>>["setValue"],
  data: ApiVehicleResponse,
) => {
  const options = { shouldDirty: true, shouldValidate: true } as const;

  // Orden catálogo: marca → modelo → año → versión (selectores en cascada).
  setValue("catalog_make_id", data.catalog_make_id, options);
  setValue("catalog_model_id", data.catalog_model_id, options);
  setValue("catalog_year_id", data.catalog_year_id, options);
  setValue("version_id", data.version_id, options);

  setValue("transmission_type", data.transmission_type, options);
  setValue("traction_id", data.traction_id, options);

  if (data.power != null) {
    setValue("power", data.power, options);
  }

  const displacement = parseDisplacementCc(data.displacement);
  if (displacement != null) {
    setValue("displacement", displacement, options);
  }

  if (data.license_plate) {
    setValue("license_plate", data.license_plate, options);
  }

  if (data.vin) {
    setValue("vin_code", data.vin, options);
  }
};

export const QuickVehicleIdentificationStep = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { lookupByLicensePlate, lookupByVin, isLoading, result } =
    useVehicleIdentificationLookup();
  
  const handleLookupOutcome = (outcome: VehicleIdentificationLookupOutcome) => {
    if (outcome.error) {
      toast.error(getLookupErrorMessage(outcome.error));
      return;
    }

    if (!outcome.data) {
      return;
    }
    applyIdentificationToForm(form.setValue, outcome.data);
    toast.success("Datos del vehículo aplicados al formulario.");
  };

  const handleLookupByPlate = async () => {
    const plate = form.getValues("license_plate")?.trim() ?? "";
    if (plate.replace(/\s+/g, "").length < 5) {
      toast.error("Introduce una matrícula válida para buscar.");
      return;
    }

    const outcome = await lookupByLicensePlate(plate);
    handleLookupOutcome(outcome);
  };

  const handleLookupByVin = async () => {
    const vin = form.getValues("vin_code")?.trim() ?? "";
    if (vin.replace(/\s+/g, "").length < 11) {
      toast.error("Introduce un VIN válido para buscar.");
      return;
    }

    const outcome = await lookupByVin(vin);
    handleLookupOutcome(outcome);
  };

  return (
    <section className="flex flex-col gap-4">
      <VehicleFormStep
        number={2}
        label="Identificación del vehículo"
        description="Opcional. Busca por matrícula o VIN para rellenar automáticamente los datos del vehículo."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ControllerInput name="license_plate" control={form.control} label="Matrícula" optional>
          {({ field, fieldState }) => (
            <Input
              {...field}
              value={String(field.value ?? "")}
              placeholder="Ej. 1234 ABC"
              aria-invalid={fieldState.invalid}
            />
          )}
        </ControllerInput>
        <ControllerInput name="vin_code" control={form.control} label="VIN / bastidor" optional>
          {({ field, fieldState }) => (
            <Input
              {...field}
              value={String(field.value ?? "")}
              placeholder="Opcional"
              aria-invalid={fieldState.invalid}
            />
          )}
        </ControllerInput>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleLookupByPlate}
            disabled={isLoading}
            className="w-full sm:w-auto"
            aria-label="Buscar vehículo por matrícula"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Search className="size-4" aria-hidden />
            )}
            Buscar por matrícula
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleLookupByVin}
            disabled={isLoading}
            className="w-full sm:w-auto"
            aria-label="Buscar vehículo por VIN"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Search className="size-4" aria-hidden />
            )}
            Buscar por VIN
          </Button>
        </div>
        <div className="flex-1">
          <QuickVehicleIdentificationPreview result={result} />
        </div>
      </div>
    </section>
  );
};
