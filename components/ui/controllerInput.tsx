import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Info } from "lucide-react";

import { formatFieldLabel } from "@/components/vehicles/constants/vehicle-form-field-meta";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Field, FieldError, FieldLabel } from "./field";
import { Input } from "./input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface ControllerInputProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "children"> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  /** Muestra «(opcional)» en la etiqueta. Alineado con `CreateVehicleHttpDto`. */
  optional?: boolean;
  orientation?: "vertical" | "horizontal";
  children?: (props: {
    field: ControllerRenderProps<T, FieldPath<T>>;
    fieldState: ControllerFieldState;
  }) => ReactNode;
  tooltipContent?: string;
}

export const ControllerInput = <T extends FieldValues>({
  name,
  control,
  label,
  optional = false,
  children,
  orientation = "vertical",
  tooltipContent,
  id,
  ...inputProps
}: ControllerInputProps<T>) => {
  const inputId = id ?? String(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className="flex flex-col gap-1"
        >
          <div
            className={cn(
              "flex flex-col gap-1",
              orientation === "horizontal" && "flex-row items-center gap-2",
            )}
          >
            {label ? (
              <FieldLabel className="flex items-center gap-2" htmlFor={inputId}>
                {formatFieldLabel(label, optional)}
                {tooltipContent ? (
                  <Tooltip>
                    <TooltipTrigger
                      delay={0}
                      render={
                        <Button variant="ghost" size="icon" type="button">
                          <Info className="size-4" />
                        </Button>
                      }
                    />
                    <TooltipContent>{tooltipContent}</TooltipContent>
                  </Tooltip>
                ) : null}
              </FieldLabel>
            ) : null}

            {children ? (
              children({ field, fieldState })
            ) : (
              <Input
                {...inputProps}
                {...field}
                id={inputId}
                aria-invalid={fieldState.invalid}
              />
            )}
          </div>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
