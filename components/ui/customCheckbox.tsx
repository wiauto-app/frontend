"use client";

import { useId } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type CustomCheckboxProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "className"
> & {
  className?: string;
  label?: React.ReactNode;
  labelClassName?: string;
};

export const CustomCheckbox = ({
  className,
  label,
  labelClassName,
  disabled,
  id: idProp,
  ...inputProps
}: CustomCheckboxProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        className="peer sr-only"
        {...inputProps}
      />
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition-colors",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
          "group-has-checked:border-primary group-has-checked:bg-primary group-has-checked:text-primary-foreground",
          "peer-disabled:cursor-not-allowed",
        )}
      >
        <Check
          className="size-5 stroke-3 opacity-0 transition-opacity group-has-checked:opacity-100"
          aria-hidden
        />
      </span>
      {label ? (
        <span className={cn("text-sm text-slate-700 select-none", labelClassName)}>
          {label}
        </span>
      ) : null}
    </label>
  );
};
