"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { QuickVehicleIntroStep } from "./quick-vehicle-wizard.constants";

interface QuickPublishStepIndicatorProps {
  step: QuickVehicleIntroStep;
  isActive: boolean;
  isCompleted: boolean;
  isPending: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  labelClassName?: string;
}

export const QuickPublishStepIndicator = ({
  step,
  isActive,
  isCompleted,
  isPending,
  disabled = false,
  onClick,
  className,
  labelClassName,
}: QuickPublishStepIndicatorProps) => {
  const Icon = step.icon;

  const content = (
    <>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
          isActive && "bg-primary text-primary-foreground ring-4 ring-primary/15",
          isCompleted && !isActive && "bg-primary text-primary-foreground",
          isPending && "bg-muted text-muted-foreground",
        )}
      >
        {isCompleted && !isActive ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Icon className="size-4" aria-hidden />
        )}
      </span>
      <span
        className={cn(
          "max-w-[5.5rem] text-center text-[10px] leading-tight sm:max-w-24 sm:text-xs",
          isActive && "font-semibold text-primary",
          isCompleted && !isActive && "text-muted-foreground",
          isPending && "text-muted-foreground/70",
          labelClassName,
        )}
      >
        {step.name}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-current={isActive ? "step" : undefined}
        className={cn(
          "flex min-w-0 flex-col items-center gap-1 transition-opacity",
          disabled && "cursor-not-allowed opacity-80",
          !disabled && !isPending && "hover:opacity-90",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-1", className)}>
      {content}
    </div>
  );
};
