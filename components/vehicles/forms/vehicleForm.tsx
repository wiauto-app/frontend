"use client";

import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  updateVehicleSchema,
  vehicleSchema,
} from "../schemas/vehicle.schema";
import type { UpdateVehicleSchema, VehicleSchema } from "../types/vehicles.types";
import { createVehicleDefaultValues } from "../types/vehicles.types";
import { VehicleFormSteps } from "./vehicleFormSteps";
import { useEffect, useMemo, useState } from "react";
import { VehicleDataForm } from "./vehicleDataForm";
import { FeaturesForm } from "./featuresForm";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingDescForm } from "./pricingDescForm";
import { MediaForm } from "./mediaForm";
import { VehicleSummaryForm } from "./vehicleSummaryForm";
import { vehiclesService } from "../services/vehiclesService";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { mapVehicleDetailToFormValues } from "../utils/mapVehicleDetailToFormValues";

type VehicleFormProps = {
  vehicleId?: string;
  onSuccess?: () => void;
};

export const VehicleForm = ({ vehicleId, onSuccess }: VehicleFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const isEditMode = Boolean(vehicleId);
  const formSchema = isEditMode ? updateVehicleSchema : vehicleSchema;

  const { data: vehicleDetail, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehiclesService.findOne(vehicleId ?? ""),
    enabled: isEditMode,
  });

  const form = useForm<VehicleSchema>({
    resolver: standardSchemaResolver(formSchema) as Resolver<VehicleSchema>,
    defaultValues: createVehicleDefaultValues,
  });

  useEffect(() => {
    if (vehicleDetail) {
      const initialValues = mapVehicleDetailToFormValues(vehicleDetail);
      form.reset(initialValues);
    }
  }, [vehicleDetail, form]);

  useEffect(() => {
    if (!vehicleId) {
      form.reset(createVehicleDefaultValues);
      setCurrentStep(1);
    }
  }, [vehicleId, form]);

  const handleNextStep = () => {
    if (currentStep === 5) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep === 1) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  const hasNextStep = useMemo(() => currentStep < 5, [currentStep]);
  const hasPreviousStep = useMemo(() => currentStep > 1, [currentStep]);

  const handleSubmit = async (data: VehicleSchema) => {
    if (vehicleId) {
      const response = await vehiclesService.update(
        vehicleId,
        data as UpdateVehicleSchema,
      );
      if (response.ok) {
        toast.success("Vehículo actualizado correctamente");
        onSuccess?.();
      } else {
        toast.error(response.message || "Error al actualizar el vehículo");
      }
      return;
    }

    const response = await vehiclesService.create(data);
    if (response.ok) {
      toast.success("Vehículo creado correctamente");
      onSuccess?.();
    } else {
      toast.error(response.message || "Error al crear el vehículo");
    }
  };

  if (isEditMode && isLoadingVehicle) {
    return (
      <div
        className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground"
        aria-live="polite"
      >
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Cargando anuncio…
      </div>
    );
  }

  const vehiclePrices =
    vehicleDetail?.vehicle_prices ?? vehicleDetail?.prices ?? [];

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="md:col-span-2">
          <VehicleFormSteps currentStep={currentStep} />
        </div>
        {currentStep === 1 && <VehicleDataForm />}
        {currentStep === 2 && <FeaturesForm />}
        {currentStep === 3 && (
          <PricingDescForm
            vehicle_prices={vehiclePrices}
            isEditMode={isEditMode}
          />
        )}
        {currentStep === 4 && <MediaForm />}
        {currentStep === 5 && <VehicleSummaryForm />}
        <div className="col-span-2 flex items-center justify-between">
          <Button
            disabled={!hasPreviousStep}
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
          >
            <ArrowLeft className="size-4" />
            Anterior
          </Button>
          {hasNextStep && (
            <Button type="button" onClick={handleNextStep}>
              Siguiente <ArrowRight className="size-4" />
            </Button>
          )}
          {currentStep === 5 && (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEditMode ? "Actualizar anuncio" : "Guardar"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
