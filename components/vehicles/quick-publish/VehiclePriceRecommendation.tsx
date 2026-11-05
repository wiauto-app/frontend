"use client";

import { useState } from "react";
import { Euro, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import type { RecommendVehiclePriceResponse } from "@/components/vehicles/services/vehicleAiService";
import {
  useVehicleAiAction,
  VEHICLE_AI_MISSING_FIELDS_MESSAGE,
} from "@/hooks/useVehicleAiAction";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/app/contexts/auth/useUser";
import { GUEST_RATE_LIMIT_MESSAGE } from "@/lib/api";

export type VehiclePriceRecommendationStatus =
  | "idle"
  | "loading"
  | "success"
  | "rate_limited";

const eurFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const formatVehiclePriceEur = (value: number): string =>
  eurFormatter.format(value);

export const buildVehiclePriceRangeLabel = (
  rangeMin: number,
  rangeMax: number,
): string =>
  `${formatVehiclePriceEur(rangeMin)} - ${formatVehiclePriceEur(rangeMax)}`;

export const resolveVehiclePriceRecommendationStatus = (
  data: RecommendVehiclePriceResponse | null,
  executeError: "rate_limited" | "generic" | null,
): VehiclePriceRecommendationStatus => {
  if (executeError === "rate_limited") {
    return "rate_limited";
  }

  if (!data) {
    return "idle";
  }

  return "success";
};

interface VehiclePriceRecommendationProps {
  onPriceBlur?: () => void;
}

/** Precio + recomendación WiAuto dentro de la tarjeta destacada del paso de publicar. */
export const VehiclePriceRecommendation = ({
  onPriceBlur,
}: VehiclePriceRecommendationProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const { execute, canExecute } = useVehicleAiAction("recommendPrice");
  const { isAuthenticated } = useUser();
  const [status, setStatus] =
    useState<VehiclePriceRecommendationStatus>("idle");
  const [result, setResult] = useState<RecommendVehiclePriceResponse | null>(
    null,
  );

  const handleCalculatePrice = async () => {
    setStatus("loading");
    setResult(null);

    const { data, error: executeError } = await execute();

    setResult(data);
    setStatus(resolveVehiclePriceRecommendationStatus(data, executeError));
  };

  const handleUseRecommendedPrice = () => {
    if (!result) {
      return;
    }

    form.setValue("price", result.recommended_price, {
      shouldDirty: true,
      shouldValidate: true,
    });

    toast.success("Precio recomendado aplicado correctamente");
  };

  const isLoading = status === "loading";
  const showResult = status === "success" && result != null;
  const isCalculateDisabled = !canExecute || isLoading;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <Euro className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold leading-snug text-primary">
            Precio de venta
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            void handleCalculatePrice();
          }}
          disabled={isCalculateDisabled}
          className="w-fit shrink-0"
          aria-label="Calcular precio justo del vehículo"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Calculando…
            </>
          ) : (
            "Calcular precio justo"
          )}
        </Button>
      </div>

      <ControllerInput name="price" control={form.control}>
        {({ field, fieldState }) => (
          <div className="relative">
            <Input
              {...field}
              value={field.value == null ? "" : String(field.value)}
              type="number"
              inputMode="numeric"
              min={1}
              max={9999999}
              placeholder="Ej. 12.500"
              aria-label="Precio en euros"
              aria-invalid={fieldState.invalid}
              className={cn(
                "h-11 border-white/80 bg-white pr-10 text-lg font-semibold tabular-nums shadow-sm",
                "placeholder:font-normal placeholder:text-muted-foreground",
              )}
              onBlur={() => {
                field.onBlur();
                onPriceBlur?.();
              }}
            />
            <span
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground"
              aria-hidden="true"
            >
              €
            </span>
          </div>
        )}
      </ControllerInput>

      {showResult ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold tabular-nums text-foreground">
            {buildVehiclePriceRangeLabel(result.range_min, result.range_max)}
          </p>
          {result.explanation ? (
            <p className="text-xs text-muted-foreground">{result.explanation}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={handleUseRecommendedPrice}
            className="w-fit"
            aria-label="Usar precio recomendado en el formulario"
          >
            Usar precio recomendado
          </Button>
        </div>
      ) : null}

      {!canExecute ? (
        <p className="text-sm text-muted-foreground">
          {VEHICLE_AI_MISSING_FIELDS_MESSAGE}
        </p>
      ) : null}

      {status === "rate_limited" ? (
        <p className="text-sm text-destructive">
          {isAuthenticated
            ? "Has alcanzado el límite de solicitudes. Espera un momento e inténtalo de nuevo."
            : GUEST_RATE_LIMIT_MESSAGE}
        </p>
      ) : null}
    </div>
  );
};
