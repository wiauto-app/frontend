"use client";

import { useCallback, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  buildVehicleAiContext,
  isVehicleAiRateLimited,
  VEHICLE_AI_RATE_LIMIT_MESSAGE,
  vehicleAiService,
  type GenerateVehicleDescriptionResponse,
  type RecommendVehiclePriceResponse,
} from "@/components/vehicles/services/vehicleAiService";

export type VehicleAiAction = "recommendPrice" | "generateDescription";

export type VehicleAiActionError = "rate_limited" | "generic";

export const VEHICLE_AI_MISSING_FIELDS_MESSAGE =
  "Completa la ficha del vehículo para usar esta función";

const isValidUuid = (value: string | undefined | null): boolean =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export const getVehicleAiCanExecute = (
  action: VehicleAiAction,
  values: QuickVehicleSchema,
): boolean => {
  const hasBaseFields =
    values.version_id > 0 &&
    Boolean(values.condition) &&
    values.mileage != null &&
    !Number.isNaN(Number(values.mileage)) &&
    values.lat != null &&
    !Number.isNaN(Number(values.lat)) &&
    values.lng != null &&
    !Number.isNaN(Number(values.lng));

  if (action === "recommendPrice") {
    return hasBaseFields;
  }

  return (
    hasBaseFields &&
    Boolean(values.transmission_type) &&
    values.power > 0 &&
    isValidUuid(values.traction_id)
  );
};

type VehicleAiActionResultMap = {
  recommendPrice: RecommendVehiclePriceResponse;
  generateDescription: GenerateVehicleDescriptionResponse;
};

export interface VehicleAiExecuteResult<TAction extends VehicleAiAction> {
  data: VehicleAiActionResultMap[TAction] | null;
  error: VehicleAiActionError | null;
}

interface UseVehicleAiActionResult<TAction extends VehicleAiAction> {
  execute: () => Promise<VehicleAiExecuteResult<TAction>>;
  isPending: boolean;
  error: VehicleAiActionError | null;
  canExecute: boolean;
}

export const useVehicleAiAction = <TAction extends VehicleAiAction>(
  action: TAction,
): UseVehicleAiActionResult<TAction> => {
  const form = useFormContext<QuickVehicleSchema>();
  const watchedValues = useWatch({ control: form.control });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<VehicleAiActionError | null>(null);

  const formValues = useMemo(
    () => ({ ...form.getValues(), ...watchedValues }) as QuickVehicleSchema,
    [form, watchedValues],
  );

  const canExecute = useMemo(
    () => getVehicleAiCanExecute(action, formValues),
    [action, formValues],
  );

  const execute = useCallback(async (): Promise<
    VehicleAiExecuteResult<TAction>
  > => {
    if (!canExecute || isPending) {
      return { data: null, error: null };
    }

    setIsPending(true);
    setError(null);

    const context = buildVehicleAiContext(form.getValues());

    try {
      if (action === "recommendPrice") {
        const response = await vehicleAiService.recommendPrice(context);

        if (isVehicleAiRateLimited(response)) {
          toast.error(VEHICLE_AI_RATE_LIMIT_MESSAGE);
          setError("rate_limited");
          return { data: null, error: "rate_limited" };
        }

        if (!response.ok || !response.data) {
          setError("generic");
          return { data: null, error: "generic" };
        }

        return {
          data: response.data as VehicleAiActionResultMap[TAction],
          error: null,
        };
      }

      const response = await vehicleAiService.generateDescription(context);

      if (isVehicleAiRateLimited(response)) {
        toast.error(VEHICLE_AI_RATE_LIMIT_MESSAGE);
        setError("rate_limited");
        return { data: null, error: "rate_limited" };
      }

      if (!response.ok || !response.data?.description) {
        setError("generic");
        return { data: null, error: "generic" };
      }

      return {
        data: response.data as VehicleAiActionResultMap[TAction],
        error: null,
      };
    } catch {
      setError("generic");
      return { data: null, error: "generic" };
    } finally {
      setIsPending(false);
    }
  }, [action, canExecute, form, isPending]);

  return {
    execute,
    isPending,
    error,
    canExecute,
  };
};
