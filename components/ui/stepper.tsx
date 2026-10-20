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
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isPending = currentStep < step.id;
        const StepIcon = step.icon;

        return (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              disabled={isPending}
              className={cn(
                "flex flex-col items-center gap-1.5 group",
                isPending && "cursor-not-allowed",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/15",
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
                  "max-w-24 text-center text-xs leading-tight",
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
                  "mx-3 mt-[-1.5rem] h-0.5 flex-1",
                  currentStep > step.id ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
