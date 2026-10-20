"use client";

import { useCallback, useEffect, useMemo } from "react";

import { useEntitlements } from "@/hooks/useEntitlements";
import { useFiltersManager } from "@/hooks/useFiltersManager";

import {
  parseQuickVehicleStep,
  QUICK_VEHICLE_INTRO_STEPS,
  QUICK_VEHICLE_STEP_QUERY_PARAM,
  type QuickVehicleIntroStep,
} from "../quick-vehicle-wizard.constants";

const isSubscriberOnlyStep = (stepId: number) => stepId === 3;

export const useQuickPublishWizardSteps = () => {
  const { values, handleChange } = useFiltersManager({
    keys: [QUICK_VEHICLE_STEP_QUERY_PARAM],
  });

  const { isSubscribed } = useEntitlements();

  const requestedStep =
    parseQuickVehicleStep(
      values[QUICK_VEHICLE_STEP_QUERY_PARAM]?.toString() ?? null,
    ) ?? 1;

  const stepItems = useMemo(
    () =>
      QUICK_VEHICLE_INTRO_STEPS.filter((step) => {
        if (isSubscriberOnlyStep(step.id)) {
          return isSubscribed;
        }

        return true;
      }),
    [isSubscribed],
  );

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
      if (targetIndex < 0 || targetIndex >= currentStepIndex) {
        return;
      }

      navigateToStep(step);
    },
    [stepItems, currentStepIndex, navigateToStep],
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
