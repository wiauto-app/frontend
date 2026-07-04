"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  useVehicleAiAction,
  VEHICLE_AI_MISSING_FIELDS_MESSAGE,
} from "@/hooks/useVehicleAiAction";

export const QuickVehicleAiDescriptionCard = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { execute, isPending, canExecute } =
    useVehicleAiAction("generateDescription");

  const handleGenerateDescription = async () => {
    const { data } = await execute();
    if (!data?.description) {
      return;
    }

    form.setValue("description", data.description, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border border-primary bg-primary/5 p-4">
      <div className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Sparkles className="size-8 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-medium text-primary">
            Genera una descripción de calidad con IA
          </p>
          <p className="text-sm text-muted-foreground">
            Usa la marca, el kilometraje, el estado, la ficha técnica y el resto
            de datos del anuncio para redactar una descripción formateada y
            profesional, lista para publicar en el mercado de ocasión en España.
          </p>
        </div>
      </div>

      {!canExecute ? (
        <p className="text-sm text-muted-foreground">
          {VEHICLE_AI_MISSING_FIELDS_MESSAGE}
        </p>
      ) : null}

      <Button
        type="button"
        onClick={handleGenerateDescription}
        disabled={!canExecute || isPending}
        aria-label="Generar descripción del vehículo con IA"
        className="w-fit"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Generando…
          </>
        ) : (
          "Generar descripción"
        )}
      </Button>
    </div>
  );
};
