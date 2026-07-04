"use client";

import { useState } from "react";
import { Euro, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import type {
  RecommendVehiclePriceResponse,
  RecommendVehiclePriceSource,
} from "@/components/vehicles/services/vehicleAiService";
import {
  useVehicleAiAction,
  VEHICLE_AI_MISSING_FIELDS_MESSAGE,
} from "@/hooks/useVehicleAiAction";

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

export const buildVehiclePriceSampleLabel = (sampleCount: number): string =>
  `Basado en ${sampleCount} vehículos similares en tu zona (España)`;

export const buildVehiclePriceSourceLabel = (
  source: RecommendVehiclePriceSource,
  sampleCount: number,
): string => {
  if (source === "platform") {
    return buildVehiclePriceSampleLabel(sampleCount);
  }

  return "Estimación basada en el mercado español (IA). A medida que haya más anuncios similares en WiAuto, usaremos datos reales de la plataforma.";
};

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

export const VehiclePriceRecommendation = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const { execute, canExecute } = useVehicleAiAction("recommendPrice");
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
  };

  const isLoading = status === "loading";
  const showResult = status === "success";

  return (
    <div className="flex flex-col gap-4 rounded-md border border-primary bg-primary/5 p-4">
      <div className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Euro className="size-8 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="font-medium text-primary">Precio justo según WiAuto</p>

          {showResult && result ? (
            <>
              <div className="flex flex-wrap items-baseline gap-2 text-3xl font-bold md:text-4xl">
                <span>{formatVehiclePriceEur(result.range_min)}</span>
                <span className="text-2xl font-normal text-muted-foreground">
                  -
                </span>
                <span>{formatVehiclePriceEur(result.range_max)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {buildVehiclePriceSourceLabel(
                  result.source,
                  result.sample_count,
                )}
              </p>
              {result.explanation ? (
                <p className="text-sm text-foreground">{result.explanation}</p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Calcula un rango orientativo según vehículos similares publicados
              en WiAuto cerca de tu ubicación.
            </p>
          )}
        </div>
      </div>

      {!canExecute ? (
        <p className="text-sm text-muted-foreground">
          {VEHICLE_AI_MISSING_FIELDS_MESSAGE}
        </p>
      ) : null}

      {status === "rate_limited" ? (
        <p className="text-sm text-destructive">
          Has alcanzado el límite de solicitudes. Espera un momento e inténtalo
          de nuevo.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={handleCalculatePrice}
          disabled={!canExecute || isLoading}
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

        {status === "success" && result ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleUseRecommendedPrice}
            aria-label="Usar precio recomendado en el formulario"
          >
            Usar precio recomendado (
            {formatVehiclePriceEur(result.recommended_price)})
          </Button>
        ) : null}
      </div>
    </div>
  );
};
