"use client";

import { useQuickPublishWizardSteps } from "./hooks/useQuickPublishWizardSteps";
import { getQuickPublishStepMotivation } from "./quick-vehicle-wizard.constants";

export const QuickPublishStepProgress = () => {
  const { currentStepIndex, stepItems } = useQuickPublishWizardSteps();
  const totalSteps = stepItems.length;
  const currentHumanStep = currentStepIndex + 1;
  const progressPercent =
    totalSteps > 0 ? Math.round((currentHumanStep / totalSteps) * 100) : 0;
  const motivation = getQuickPublishStepMotivation(
    currentStepIndex,
    totalSteps,
  );

  return (
    <div className="w-full min-w-0 space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        Paso {currentHumanStep} de {totalSteps} · {motivation}
      </p>
      <div
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressPercent}
        className="h-1.5 w-full overflow-hidden rounded-full bg-primary/20"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
