"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { Button } from "@/components/ui/button";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  useVehicleIdentificationLookup,
  type VehicleIdentificationLookupResult,
} from "./hooks/useVehicleIdentificationLookup";

const QuickVehicleIdentificationPreview = ({
  result,
}: {
  result: VehicleIdentificationLookupResult | null;
}) => {
  if (!result) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
        Los datos detectados por matrícula aparecerán aquí cuando la integración esté disponible.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 text-sm">
      <p className="mb-2 font-medium">Datos detectados</p>
      <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {result.make ? (
          <>
            <dt className="text-muted-foreground">Marca</dt>
            <dd>{result.make}</dd>
          </>
        ) : null}
        {result.model ? (
          <>
            <dt className="text-muted-foreground">Modelo</dt>
            <dd>{result.model}</dd>
          </>
        ) : null}
        {result.year ? (
          <>
            <dt className="text-muted-foreground">Año</dt>
            <dd>{result.year}</dd>
          </>
        ) : null}
      </dl>
    </div>
  );
};

export const QuickVehicleIdentificationStep = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { lookupByLicensePlate, isLoading, result } = useVehicleIdentificationLookup();

  const handleLookup = async () => {
    const plate = form.getValues("license_plate")?.trim() ?? "";
    if (plate.length < 5) {
      toast.error("Introduce una matrícula válida para buscar.");
      return;
    }

    const lookupResult = await lookupByLicensePlate(plate);
    if (!lookupResult) {
      toast.message("Próximamente", {
        description: "La búsqueda por matrícula estará disponible en breve.",
      });
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <VehicleFormStep
        number={2}
        label="Identificación del vehículo"
        description="Opcional. Puedes añadir matrícula y VIN para facilitar la gestión del anuncio."
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
        <Button
          type="button"
          variant="outline"
          onClick={handleLookup}
          disabled={isLoading}
          className="shrink-0"
        >
          <Search className="size-4" />
          Buscar por matrícula
        </Button>
        <div className="flex-1">
          <QuickVehicleIdentificationPreview result={result} />
        </div>
      </div>
    </section>
  );
};
