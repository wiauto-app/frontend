"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
  icon?: LucideIcon;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]",
        className,
      )}
    >
      <div className="flex min-w-max items-center justify-between px-0.5 pb-1">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className="flex shrink-0 items-center last:flex-none"
            >
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                disabled={isPending}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex w-[5.25rem] shrink-0 flex-col items-center gap-1.5 sm:w-20",
                  isPending && "cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isActive &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/15",
                    isCompleted && "bg-primary text-primary-foreground",
                    isPending && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" aria-hidden />
                  ) : StepIcon ? (
                    <StepIcon className="size-4" aria-hidden />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={cn(
                    "w-full px-0.5 text-center text-[10px] leading-tight sm:text-xs",
                    isActive && "font-semibold text-primary",
                    isCompleted && "text-muted-foreground",
                    isPending && "text-muted-foreground/70",
                  )}
                >
                  {step.name}
                </span>
              </button>
              {idx < steps.length - 1 ? (
                <div
                  className={cn(
                    "mx-1 mt-[-1.5rem] h-0.5 w-6 shrink-0 sm:mx-2 sm:w-10",
                    currentStep > step.id ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
