"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between ", className)}>
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isPending = currentStep < step.id;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => onStepClick(step.id)}
              disabled={isPending}
              className={cn(
                "flex flex-col items-center gap-1.5 group",
                isPending && "cursor-not-allowed",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold shrink-0 transition-colors",
                  isActive && "bg-blue-600 text-white ring-4 ring-blue-100",
                  isCompleted && "bg-blue-600 text-white",
                  isPending && "bg-gray-100 text-gray-400",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </span>
              <span
                className={cn(
                  "text-xs text-center leading-tight max-w-24",
                  isActive && "text-blue-700 font-semibold",
                  isCompleted && "text-gray-600",
                  isPending && "text-gray-400",
                )}
              >
                {step.name}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3 mt-[-1.5rem]",
                  currentStep > step.id ? "bg-blue-600" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
