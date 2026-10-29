"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldPath } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

import { QuickVehicleCarStep } from "./QuickVehicleCarStep";
import { QuickVehicleContactStep } from "./QuickVehicleContactStep";
import { QuickVehicleDetailsStep } from "./QuickVehicleDetailsStep";
import { QuickVehicleMediaStep } from "./QuickVehicleMediaStep";
import { QuickVehiclePhotosTracker } from "./QuickVehiclePhotosTracker";
import { QuickVehicleSpecsAutofill } from "./QuickVehicleSpecsAutofill";
import { FinanceWarrantyForm } from "./financeWarrantyForm";

import {
  findFirstQuickVehicleErrorField,
  QUICK_VEHICLE_FIELD_LABELS,
  QUICK_VEHICLE_STEP_IDS,
  QUICK_VEHICLE_SUBMIT_ATTR,
  type QuickVehicleFieldErrorMatch,
} from "./quick-vehicle-wizard.constants";
import { focusQuickVehicleField } from "./utils/focus-quick-vehicle-field";

import { cn } from "@/lib/utils";
import {
  trackPublishSubmitClick,
  trackPublishValidationError,
  type PublishValidationTrigger,
} from "@/lib/analytics/funnel";
import { QuickVehiclePublishInicioTracker } from "./QuickVehiclePublishInicioTracker";
import { useQuickPublishWizardSteps } from "./hooks/useQuickPublishWizardSteps";

interface QuickVehicleIntroWizardProps {
  vehicleId?: string;
  contactName: string;
  isEditMode?: boolean;
  hasIncompleteImageUploads?: boolean;
  onImageUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
}

export const QuickVehicleIntroWizard = ({
  vehicleId,
  contactName,
  isEditMode = false,
  hasIncompleteImageUploads = false,
  onImageUploadStatusChange,
}: QuickVehicleIntroWizardProps) => {
  const form = useFormContext<QuickVehicleSchema>();

  const {
    stepItems,
    currentStep,
    currentStepIndex,
    currentStepConfig,
    navigateToStep,
    handleStepClick,
    isFirstStep,
    isLastStep,
  } = useQuickPublishWizardSteps({ isEditMode });

  const handledSubmitCountRef = useRef(0);
  const [pendingFocusField, setPendingFocusField] = useState<
    FieldPath<QuickVehicleSchema> | null
  >(null);
  const { errors, submitCount } = form.formState;

  const reportValidationError = (
    match: QuickVehicleFieldErrorMatch,
    trigger: PublishValidationTrigger,
  ) => {
    const label = QUICK_VEHICLE_FIELD_LABELS[match.field] ?? match.step.name;
    toast.error(`Revisa «${label}»: ${match.message}`);

    if (!isEditMode) {
      trackPublishValidationError({
        field: match.field,
        step: match.step.name,
        trigger,
      });
    }
  };

  useEffect(() => {
    if (submitCount === 0 || submitCount <= handledSubmitCountRef.current) {
      return;
    }

    handledSubmitCountRef.current = submitCount;
    const match = findFirstQuickVehicleErrorField(errors, stepItems);

    if (!match) {
      return;
    }

    if (match.step.id !== currentStep) {
      navigateToStep(match.step.id);
    }

    setPendingFocusField(match.field);
    reportValidationError(match, "publicar");
  }, [currentStep, errors, stepItems, submitCount, navigateToStep]);

  useEffect(() => {
    if (!pendingFocusField) {
      return;
    }

    const match = findFirstQuickVehicleErrorField(errors, stepItems);
    if (!match || match.field !== pendingFocusField) {
      setPendingFocusField(null);
      return;
    }

    if (match.step.id !== currentStep) {
      return;
    }

    const fieldToFocus = pendingFocusField;
    const frame = requestAnimationFrame(() => {
      focusQuickVehicleField(fieldToFocus);
      setPendingFocusField(null);
    });

    return () => cancelAnimationFrame(frame);
  }, [currentStep, errors, pendingFocusField, stepItems]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (isFirstStep) {
      return;
    }

    const previous = stepItems[currentStepIndex - 1];
    if (previous) {
      navigateToStep(previous.id);
      scrollToTop();
    }
  };

  const handleNext = async () => {
    if (!currentStepConfig) {
      return;
    }

    if (currentStepConfig.fields.length > 0) {
      const isValid = await form.trigger(currentStepConfig.fields);

      if (!isValid) {
        const match = findFirstQuickVehicleErrorField(
          form.formState.errors,
          stepItems,
        );
        if (match?.field) {
          setPendingFocusField(match.field);
          reportValidationError(match, "siguiente");
        }
        return;
      }
    }

    if (isLastStep) {
      return;
    }

    const next = stepItems[currentStepIndex + 1];
    if (next) {
      navigateToStep(next.id);
      scrollToTop();
    }
  };

  const handlePublishClick = () => {
    if (isEditMode || !currentStepConfig) {
      return;
    }

    trackPublishSubmitClick({ step: currentStepConfig.name });
  };

  const renderStep = () => {
    switch (currentStep) {
      case QUICK_VEHICLE_STEP_IDS.photos:
        return (
          <QuickVehicleMediaStep
            vehicleId={vehicleId}
            onImageUploadStatusChange={onImageUploadStatusChange}
          />
        );

      case QUICK_VEHICLE_STEP_IDS.vehicle:
        return <QuickVehicleCarStep />;

      case QUICK_VEHICLE_STEP_IDS.details:
        return <QuickVehicleDetailsStep />;

      case QUICK_VEHICLE_STEP_IDS.financing:
        return <FinanceWarrantyForm />;

      case QUICK_VEHICLE_STEP_IDS.contact:
        return (
          <QuickVehicleContactStep
            contactName={contactName}
            isEditMode={isEditMode}
          />
        );

      default:
        return null;
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  // En edición se puede guardar desde cualquier paso.
  const showSubmitButton = isLastStep || isEditMode;

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {!isEditMode ? (
        <>
          <QuickVehiclePublishInicioTracker activeStep={currentStep} />
          <QuickVehiclePhotosTracker />
          <QuickVehicleSpecsAutofill />
        </>
      ) : null}
      <Stepper
        steps={stepItems}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        className="hidden overflow-x-auto pb-2 lg:flex"
      />

      {renderStep()}

      <div className="flex flex-wrap items-center gap-3">
        {!isFirstStep ? (
          <Button
            type="button"
            variant="outline"
            className={cn("w-9 sm:w-auto")}
            onClick={handlePrevious}
            aria-label="Paso anterior"
          >
            <ChevronLeft className="size-4" aria-hidden />
            <span className="hidden sm:block">Anterior</span>
          </Button>
        ) : null}

        {!isLastStep ? (
          <Button
            type="button"
            variant={isEditMode ? "outline" : "default"}
            className="flex-1 sm:flex-none"
            onClick={handleNext}
          >
            Siguiente
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        ) : null}

        {showSubmitButton ? (
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || hasIncompleteImageUploads}
            className="w-full sm:w-auto"
            {...{ [QUICK_VEHICLE_SUBMIT_ATTR]: "true" }}
            aria-disabled={isSubmitting || hasIncompleteImageUploads}
            onClick={handlePublishClick}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
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
