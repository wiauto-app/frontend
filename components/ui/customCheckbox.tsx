"use client";

import { useEffect, useId, useRef } from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

export type CustomCheckboxProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "className"
> & {
  className?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  indeterminate?: boolean;
};

export const CustomCheckbox = ({
  className,
  label,
  labelClassName,
  disabled,
  id: idProp,
  indeterminate = false,
  checked,
  ...inputProps
}: CustomCheckboxProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const input_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input_ref.current) {
      input_ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate, checked]);

  return (
    <label
      htmlFor={id}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        ref={input_ref}
        type="checkbox"
        id={id}
        disabled={disabled}
        checked={checked}
        className="peer sr-only"
        {...inputProps}
      />
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition-colors",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
          "peer-indeterminate:border-primary peer-indeterminate:bg-primary/20",
          "group-has-checked:border-primary group-has-checked:bg-primary group-has-checked:text-primary-foreground",
          "peer-disabled:cursor-not-allowed",
        )}
      >
        <Minus
          className="size-4 stroke-3 text-primary hidden peer-indeterminate:block"
          aria-hidden
        />
        <Check
          className="size-5 stroke-3 opacity-0 transition-opacity group-has-checked:opacity-100 peer-indeterminate:opacity-0"
          aria-hidden
        />
      </span>
      {label ? (
        <span className={cn("text-sm text-slate-700 select-none flex-1", labelClassName)}>
          {label}
        </span>
      ) : null}
    </label>
  );
};
