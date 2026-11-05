"use client";

import { Loader2, Settings, Sparkles } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  useVehicleAiAction,
  VEHICLE_AI_MISSING_FIELDS_MESSAGE,
} from "@/hooks/useVehicleAiAction";
import { GeneratedDescriptionConfigFields } from "./generatedDescription/generatedDescriptionConfig";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";

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
    <div className="flex items-start gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-primary leading-snug">
                Genera una descripción de calidad con IA
              </p>
              <p className="text-sm text-muted-foreground">
                Redacta una descripción clara a partir de los datos del anuncio.
              </p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Configuración de la descripción"
                >
                  <Settings className="size-4" aria-hidden="true" />
                </Button>
              }
            />
            <PopoverContent
              align="end"
              side="right"
              className="w-[min(100vw-2rem,22rem)] p-4 sm:w-130"
            >
              <PopoverHeader className="mb-3">
                <PopoverTitle>Configuración de la descripción</PopoverTitle>
              </PopoverHeader>
              <GeneratedDescriptionConfigFields />
            </PopoverContent>
          </Popover>
        </div>

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

        {!canExecute && !isPending ? (
          <p className="text-sm text-muted-foreground" role="status">
            {VEHICLE_AI_MISSING_FIELDS_MESSAGE}
          </p>
        ) : null}

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>Descripción</FieldLabel>
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
                    <>
                      <Sparkles className="size-4" aria-hidden="true" />
                      Generar descripción
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                id="quick-description"
                className="h-28 resize-none whitespace-pre-wrap bg-white md:h-56"
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        ></Controller>
      </div>
    </div>
  );
};
