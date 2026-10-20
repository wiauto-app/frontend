"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

import { QuickVehicleMainSections } from "./QuickVehicleMainSections";
import { QuickVehicleTypeStep } from "./QuickVehicleTypeStep";
import { FinanceWarrantyForm } from "./financeWarrantyForm";

import {
  findQuickVehicleErrorStep,
  QUICK_VEHICLE_SUBMIT_ATTR,
} from "./quick-vehicle-wizard.constants";

import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics/funnel";
import { vehicleTypesService } from "@/components/vehicles/services/vehicleTypesService";
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
  } = useQuickPublishWizardSteps();

  const handledSubmitCountRef = useRef(0);
  const { errors, submitCount } = form.formState;

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
  }, [currentStep, errors, stepItems, submitCount, navigateToStep]);

  const handlePrevious = () => {
    if (isFirstStep) {
      return;
    }

    const previous = stepItems[currentStepIndex - 1];
    if (previous) {
      navigateToStep(previous.id);
    }
  };

  const handleNext = async () => {
    if (!currentStepConfig) {
      return;
    }

    if (currentStepConfig.fields.length > 0) {
      const isValid = await form.trigger(currentStepConfig.fields);

      if (!isValid) {
        return;
      }
    }

    if (currentStep === 1) {
      const vehicleTypeId = form.getValues("vehicle_type_id");
      if (vehicleTypeId) {
        try {
          const typesPage = await vehicleTypesService.findAll({
            page: 1,
            limit: 100,
          });
          const match = typesPage.data.find((type) => type.id === vehicleTypeId);
          track("publicar_tipo", {
            vehicle_type: match?.name?.toLowerCase() ?? vehicleTypeId,
          });
        } catch {
          track("publicar_tipo", { vehicle_type: vehicleTypeId });
        }
      }
    }

    if (isLastStep) {
      return;
    }

    const next = stepItems[currentStepIndex + 1];
    if (next) {
      navigateToStep(next.id);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <QuickVehicleTypeStep />;

      case 2:
        return (
          <QuickVehicleMainSections
            vehicleId={vehicleId}
            contactName={contactName}
            onImageUploadStatusChange={onImageUploadStatusChange}
          />
        );

      case 3:
        return <FinanceWarrantyForm />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {!isEditMode ? (
        <QuickVehiclePublishInicioTracker activeStep={currentStep} />
      ) : null}
      <Stepper
        steps={stepItems}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        className="hidden overflow-x-auto pb-2 lg:flex"
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
