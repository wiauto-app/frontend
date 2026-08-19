"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

import { QuickVehicleIdentificationStep } from "./QuickVehicleIdentificationStep";
import { QuickVehicleMainSections } from "./QuickVehicleMainSections";
import { QuickVehicleTypeStep } from "./QuickVehicleTypeStep";
import { FinanceWarrantyForm } from "./financeWarrantyForm";

import {
  findQuickVehicleErrorStep,
  parseQuickVehicleStep,
  QUICK_VEHICLE_INTRO_STEPS,
  QUICK_VEHICLE_STEP_QUERY_PARAM,
} from "./quick-vehicle-wizard.constants";

import { cn } from "@/lib/utils";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useFiltersManager } from "@/hooks/useFiltersManager";

interface QuickVehicleIntroWizardProps {
  vehicleId?: string;
  contactName: string;
  isEditMode?: boolean;
}

export const QuickVehicleIntroWizard = ({
  vehicleId,
  contactName,
  isEditMode = false,
}: QuickVehicleIntroWizardProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const { values, handleChange } = useFiltersManager({
    keys: [QUICK_VEHICLE_STEP_QUERY_PARAM],
  });

  const currentStep =
    parseQuickVehicleStep(
      values[QUICK_VEHICLE_STEP_QUERY_PARAM]?.toString() ?? null,
    ) ?? 1;

  const { isSubscribed } = useEntitlements();

  const stepItems = useMemo(
    () =>
      QUICK_VEHICLE_INTRO_STEPS.filter(step => {
        if (step.id === 4) {
          return isSubscribed;
        }

        return true;
      }),
    [isSubscribed],
  );
  const totalSteps = stepItems.length;
  const handledSubmitCountRef = useRef(0);
  const { errors, submitCount } = form.formState;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const navigateToStep = useCallback(
    (step: number) => {
      handleChange(QUICK_VEHICLE_STEP_QUERY_PARAM, String(step));
    },
    [handleChange],
  );

  useEffect(() => {
    if (submitCount === 0 || submitCount <= handledSubmitCountRef.current) {
      return;
    }

    handledSubmitCountRef.current = submitCount;
    const errorStep = findQuickVehicleErrorStep(errors, stepItems);

    if (!errorStep) {
      return;
    }

    if (errorStep.id !== currentStep) {
      navigateToStep(errorStep.id);
    }

    toast.error(`Revisa los campos del paso «${errorStep.name}».`);
  }, [currentStep, errors, navigateToStep, stepItems, submitCount]);

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      navigateToStep(step);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      navigateToStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    const stepConfig = QUICK_VEHICLE_INTRO_STEPS[currentStep - 1];

    if (stepConfig.fields.length > 0) {
      const isValid = await form.trigger(stepConfig.fields);

      if (!isValid) {
        return;
      }
    }

    if (!isLastStep) {
      navigateToStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <QuickVehicleTypeStep />;

      case 2:
        return <QuickVehicleIdentificationStep />;

      case 3:
        return (
          <QuickVehicleMainSections
            vehicleId={vehicleId}
            contactName={contactName}
          />
        );

      case 4:
        return <FinanceWarrantyForm />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {!isEditMode ? (
        <Stepper
          steps={stepItems}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="overflow-x-auto pb-2"
        />
      ) : null}

      {renderStep()}

      <div className="flex items-center gap-3">
        {!isEditMode && !isFirstStep ? (
          <Button
            type="button"
            variant="outline"
            className={cn("w-9 sm:w-auto")}
            onClick={handlePrevious}
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:block">Anterior</span>
          </Button>
        ) : null}

        {!isEditMode && !isLastStep ? (
          <Button
            type="button"
            className="flex-1 sm:flex-none"
            onClick={handleNext}
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Button>
        ) : null}

        {isLastStep ? (
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto"
            data-quick-vehicle-submit="true"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}

            {isEditMode ? "Actualizar anuncio" : "Publicar anuncio ahora"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
