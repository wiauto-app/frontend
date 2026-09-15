"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  useVehicleAiAction,
  VEHICLE_AI_MISSING_FIELDS_MESSAGE,
} from "@/hooks/useVehicleAiAction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const QuickVehicleAiDescriptionCard = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { execute, isPending, canExecute, cooldownSeconds } =
    useVehicleAiAction("generateDescription");

  const isCoolingDown = cooldownSeconds > 0;
  const isButtonDisabled = !canExecute || isPending || isCoolingDown;

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
    <Card className="rounded-md border border-primary bg-primary/5">
      <CardHeader className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Sparkles className="size-8 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold text-primary">
              Genera una descripción de calidad con IA
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Usa la marca, el kilometraje, el estado, la ficha técnica y el resto
            de datos del anuncio para redactar una descripción formateada y
            profesional, lista para publicar en el mercado de ocasión en España.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {!canExecute ? (
          <p className="text-sm text-muted-foreground">
            {VEHICLE_AI_MISSING_FIELDS_MESSAGE}
          </p>
        ) : null}

        {isCoolingDown ? (
          <p
            className="text-sm text-muted-foreground"
            aria-live="polite"
            role="status"
          >
            Podrás generar otra descripción en{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {cooldownSeconds} s
            </span>
            .
          </p>
        ) : null}

        <Button
          type="button"
          onClick={handleGenerateDescription}
          disabled={isButtonDisabled}
          aria-label={
            isCoolingDown
              ? `Generar descripción disponible en ${cooldownSeconds} segundos`
              : "Generar descripción del vehículo con IA"
          }
          className="w-fit"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Generando…
            </>
          ) : isCoolingDown ? (
            `Espera ${cooldownSeconds} s`
          ) : (
            "Generar descripción"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
