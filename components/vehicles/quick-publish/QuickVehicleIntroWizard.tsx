"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { QuickVehicleIdentificationStep } from "./QuickVehicleIdentificationStep";
import { QuickVehicleMainSections } from "./QuickVehicleMainSections";
import { QuickVehicleTypeStep } from "./QuickVehicleTypeStep";
import { QUICK_VEHICLE_INTRO_STEPS } from "./quick-vehicle-wizard.constants";

type QuickVehicleIntroWizardProps = {
  vehicleId?: string;
  contactName: string;
  isEditMode?: boolean;
};

export const QuickVehicleIntroWizard = ({
  vehicleId,
  contactName,
  isEditMode = false,
}: QuickVehicleIntroWizardProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const [currentStep, setCurrentStep] = useState(isEditMode ? 3 : 1);

  const totalSteps = QUICK_VEHICLE_INTRO_STEPS.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
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
      setCurrentStep((prev) => prev + 1);
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
          <QuickVehicleMainSections vehicleId={vehicleId} contactName={contactName} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!isEditMode ? (
        <Stepper
          steps={QUICK_VEHICLE_INTRO_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="overflow-x-auto pb-2"
        />
      ) : null}
      {renderStep()}
      <div className="flex flex-wrap items-center gap-3">
        {!isEditMode && !isFirstStep ? (
          <Button type="button" variant="outline" onClick={handlePrevious}>
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
        ) : null}
        {!isEditMode && !isLastStep ? (
          <Button type="button" onClick={handleNext}>
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
