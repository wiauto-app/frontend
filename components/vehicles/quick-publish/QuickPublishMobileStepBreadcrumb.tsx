"use client";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { QuickPublishStepIndicator } from "./QuickPublishStepIndicator";
import { useQuickPublishWizardSteps } from "./hooks/useQuickPublishWizardSteps";
import React from "react";

interface QuickPublishMobileStepBreadcrumbProps {
  className?: string;
}

export const QuickPublishMobileStepBreadcrumb = ({
  className,
}: QuickPublishMobileStepBreadcrumbProps) => {
  const { stepItems, currentStep, currentStepIndex, handleStepClick } =
    useQuickPublishWizardSteps();

  if (stepItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Pasos para publicar tu anuncio"
      className={cn("flex  items-start   gap-0.5", className)}
    >
      {stepItems.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isPending = currentStep < step.id;
        const canNavigateBack = index < currentStepIndex;
        const isLast = index === stepItems.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="w-14">
              <QuickPublishStepIndicator
                step={step}
                isActive={isActive}
                isCompleted={isCompleted}
                isPending={isPending}
                disabled={!canNavigateBack}
                onClick={
                  canNavigateBack
                    ? () => {
                        handleStepClick(step.id);
                      }
                    : undefined
                }
                className="mx-auto "
              />
            </div>
            {!isLast ? (
              <ChevronRight
                className="mt-2.5 size-3.5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
