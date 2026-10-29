"use client";

import { useCallback, useEffect, useMemo } from "react";

import { useEntitlements } from "@/hooks/useEntitlements";
import { useFiltersManager } from "@/hooks/useFiltersManager";

import {
  isSubscriberOnlyQuickVehicleStep,
  parseQuickVehicleStep,
  QUICK_VEHICLE_EDIT_STEPS,
  QUICK_VEHICLE_INTRO_STEPS,
  QUICK_VEHICLE_STEP_QUERY_PARAM,
  type QuickVehicleIntroStep,
} from "../quick-vehicle-wizard.constants";

interface UseQuickPublishWizardStepsOptions {
  isEditMode?: boolean;
}

export const useQuickPublishWizardSteps = ({
  isEditMode = false,
}: UseQuickPublishWizardStepsOptions = {}) => {
  const { values, handleChange } = useFiltersManager({
    keys: [QUICK_VEHICLE_STEP_QUERY_PARAM],
  });

  const { isSubscribed } = useEntitlements();

  const steps = isEditMode ? QUICK_VEHICLE_EDIT_STEPS : QUICK_VEHICLE_INTRO_STEPS;

  const stepItems = useMemo(
    () =>
      steps.filter((step) => {
        if (isSubscriberOnlyQuickVehicleStep(step.id)) {
          return isSubscribed;
        }

        return true;
      }),
    [isSubscribed, steps],
  );

  const requestedStep =
    parseQuickVehicleStep(
      values[QUICK_VEHICLE_STEP_QUERY_PARAM]?.toString() ?? null,
    ) ?? stepItems[0]?.id;

  const currentStepIndex = useMemo(() => {
    const index = stepItems.findIndex((step) => step.id === requestedStep);
    return index >= 0 ? index : 0;
  }, [requestedStep, stepItems]);

  const currentStep =
    stepItems[currentStepIndex]?.id ?? stepItems[0]?.id ?? 1;

  const currentStepConfig: QuickVehicleIntroStep | undefined =
    stepItems[currentStepIndex];

  const navigateToStep = useCallback(
    (step: number) => {
      handleChange(QUICK_VEHICLE_STEP_QUERY_PARAM, String(step));
    },
    [handleChange],
  );

  useEffect(() => {
    const isAvailable = stepItems.some((step) => step.id === requestedStep);
    if (isAvailable) {
      return;
    }

    const fallback = stepItems[0]?.id;
    if (fallback != null) {
      navigateToStep(fallback);
    }
  }, [requestedStep, stepItems, navigateToStep]);

  const handleStepClick = useCallback(
    (step: number) => {
      const targetIndex = stepItems.findIndex((item) => item.id === step);
      // En edición todos los datos ya existen: se puede saltar a cualquier paso.
      if (targetIndex < 0 || (!isEditMode && targetIndex >= currentStepIndex)) {
        return;
      }

      navigateToStep(step);
    },
    [stepItems, currentStepIndex, navigateToStep, isEditMode],
  );

  return {
    stepItems,
    currentStep,
    currentStepIndex,
    currentStepConfig,
    navigateToStep,
    handleStepClick,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === stepItems.length - 1,
  };
};
