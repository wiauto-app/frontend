"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { GUEST_RATE_LIMIT_MESSAGE } from "@/lib/api";

import {
  catalogVersionsService,
  VehicleSpecsRateLimitedError,
} from "../../services/catalogVersionsService";
import { useCanCharge } from "./useCanCharge";

const MAX_SPECS_RETRIES = 3;

/**
 * Rellena la ficha técnica (potencia, cilindrada, transmisión, tracción y datos
 * eléctricos) a partir de la versión elegida. Todos estos campos son opcionales:
 * si la inferencia falla, el anuncio se publica igualmente.
 */
export const useVehicleSpecsAutofill = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const versionId = form.watch("version_id");
  const tractionId = form.watch("traction_id");
  const { canCharge } = useCanCharge();

  // Un eléctrico no tiene cilindrada, pero sí potencia en CV.
  useEffect(() => {
    if (canCharge) {
      form.setValue("displacement", 0, { shouldDirty: true });
    }
  }, [canCharge]);

  /**
   * La ficha técnica la infiere un LLM con búsqueda web, así que solo se pide
   * cuando el usuario elige otra versión o cuando el anuncio todavía no tiene
   * ficha. Al editar un vehículo ya registrado se reutiliza lo guardado.
   */
  const hasStoredSpecs = Boolean(tractionId);
  const isVersionChangedByUser = Boolean(form.formState.dirtyFields.version_id);
  const shouldFetchSpecs =
    Boolean(versionId) && (isVersionChangedByUser || !hasStoredSpecs);

  const {
    data: vehicleSpecs,
    isFetching: isLoadingVehicleSpecs,
    error: vehicleSpecsError,
  } = useQuery({
    queryKey: ["vehicleSpecs", versionId],
    queryFn: () => catalogVersionsService.getVehicleSpecs(versionId),
    enabled: shouldFetchSpecs,
    // Un 429 (límite por IP de invitados) no se reintenta: solo empeora el bloqueo.
    retry: (failureCount, error) =>
      !(error instanceof VehicleSpecsRateLimitedError) &&
      failureCount < MAX_SPECS_RETRIES,
    // Las specs de una versión del catálogo no cambian: evita repetir la
    // llamada al volver a este paso del asistente (el backend también cachea en Redis).
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (vehicleSpecsError instanceof VehicleSpecsRateLimitedError) {
      toast.error(GUEST_RATE_LIMIT_MESSAGE);
    }
  }, [vehicleSpecsError]);

  useEffect(() => {
    if (!shouldFetchSpecs || !vehicleSpecs) {
      return;
    }

    form.setValue("power", vehicleSpecs.power, { shouldDirty: true });
    form.setValue("displacement", vehicleSpecs.displacement, {
      shouldDirty: true,
    });
    form.setValue("transmission_type", vehicleSpecs.transmission, {
      shouldDirty: true,
    });
    form.setValue("traction_id", vehicleSpecs.traction_id, {
      shouldDirty: true,
    });
    form.setValue("autonomy", vehicleSpecs.autonomy ?? undefined, {
      shouldDirty: true,
    });
    form.setValue(
      "battery_capacity",
      vehicleSpecs.battery_capacity ?? undefined,
      { shouldDirty: true },
    );
    form.setValue("time_to_charge", vehicleSpecs.time_to_charge ?? undefined, {
      shouldDirty: true,
    });
  }, [shouldFetchSpecs, vehicleSpecs]);

  return { isLoadingVehicleSpecs };
};
