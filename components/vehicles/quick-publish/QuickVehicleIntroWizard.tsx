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
  type QuickVehicleIntroStep,
} from "./quick-vehicle-wizard.constants";

import { cn } from "@/lib/utils";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useFiltersManager } from "@/hooks/useFiltersManager";

interface QuickVehicleIntroWizardProps {
  vehicleId?: string;
  contactName: string;
  isEditMode?: boolean;
  hasIncompleteImageUploads?: boolean;
  onImageUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
}

const is_subscriber_only_step = (step_id: number) =>
  step_id === 2 || step_id === 4;

export const QuickVehicleIntroWizard = ({
  vehicleId,
  contactName,
  isEditMode = false,
  hasIncompleteImageUploads = false,
  onImageUploadStatusChange,
}: QuickVehicleIntroWizardProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const { values, handleChange } = useFiltersManager({
    keys: [QUICK_VEHICLE_STEP_QUERY_PARAM],
  });

  const requested_step =
    parseQuickVehicleStep(
      values[QUICK_VEHICLE_STEP_QUERY_PARAM]?.toString() ?? null,
    ) ?? 1;

  const { isSubscribed } = useEntitlements();

  const stepItems = useMemo(
    () =>
      QUICK_VEHICLE_INTRO_STEPS.filter((step) => {
        if (is_subscriber_only_step(step.id)) {
          return isSubscribed;
        }

        return true;
      }),
    [isSubscribed],
  );

  const current_step_index = useMemo(() => {
    const index = stepItems.findIndex((step) => step.id === requested_step);
    return index >= 0 ? index : 0;
  }, [requested_step, stepItems]);

  const currentStep = stepItems[current_step_index]?.id ?? stepItems[0]?.id ?? 1;
  const current_step_config: QuickVehicleIntroStep | undefined =
    stepItems[current_step_index];

  const handledSubmitCountRef = useRef(0);
  const { errors, submitCount } = form.formState;

  const isFirstStep = current_step_index === 0;
  const isLastStep = current_step_index === stepItems.length - 1;

  const navigateToStep = useCallback(
    (step: number) => {
      handleChange(QUICK_VEHICLE_STEP_QUERY_PARAM, String(step));
    },
    [handleChange],
  );

  // Si la URL apunta a un paso no disponible (p. ej. sin suscripción), corrige.
  useEffect(() => {
    const is_available = stepItems.some((step) => step.id === requested_step);
    if (is_available) {
      return;
    }

    const fallback = stepItems[0]?.id;
    if (fallback != null) {
      navigateToStep(fallback);
    }
  }, [navigateToStep, requested_step, stepItems]);

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
    const target_index = stepItems.findIndex((item) => item.id === step);
    if (target_index < 0 || target_index >= current_step_index) {
      return;
    }

    navigateToStep(step);
  };

  const handlePrevious = () => {
    if (isFirstStep) {
      return;
    }

    const previous = stepItems[current_step_index - 1];
    if (previous) {
      navigateToStep(previous.id);
    }
  };

  const handleNext = async () => {
    if (!current_step_config) {
      return;
    }

    if (current_step_config.fields.length > 0) {
      const isValid = await form.trigger(current_step_config.fields);

      if (!isValid) {
        return;
      }
    }

    if (isLastStep) {
      return;
    }

    const next = stepItems[current_step_index + 1];
    if (next) {
      navigateToStep(next.id);
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
            onImageUploadStatusChange={onImageUploadStatusChange}
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
      <Stepper
        steps={stepItems}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        className="overflow-x-auto pb-2"
      />

      {renderStep()}

      <div className="flex items-center gap-3">
        {!isFirstStep ? (
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

        {!isLastStep ? (
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
            disabled={
              form.formState.isSubmitting || hasIncompleteImageUploads
            }
            className="w-full sm:w-auto"
            data-quick-vehicle-submit="true"
            aria-disabled={
              form.formState.isSubmitting || hasIncompleteImageUploads
            }
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}

            {hasIncompleteImageUploads
              ? "Subiendo imágenes…"
              : isEditMode
                ? "Actualizar anuncio"
                : "Publicar anuncio ahora"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
