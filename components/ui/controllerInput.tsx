import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";

import { formatFieldLabel } from "@/components/vehicles/constants/vehicle-form-field-meta";
import { Input } from "./input";
import { Field, FieldError, FieldLabel } from "./field";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Info } from "lucide-react";
import { Button } from "./button";

type ControllerInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  /** Muestra «(opcional)» en la etiqueta. Alineado con `CreateVehicleHttpDto`. */
  optional?: boolean;
  orientation?: "vertical" | "horizontal";
  children?: (props: {
    field: ControllerRenderProps<T, FieldPath<T>>;
    fieldState: ControllerFieldState;
  }) => React.ReactNode;
  tooltipContent?: string;
};

export const ControllerInput = <T extends FieldValues>({
  name,
  control,
  label,
  optional = false,
  children,
  orientation = "vertical",
  tooltipContent,
}: ControllerInputProps<T>) => {
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
              <FieldLabel className="flex items-center gap-2" htmlFor={name}>
                {formatFieldLabel(label, optional)}
                {tooltipContent ? (
                  <Tooltip>
                    <TooltipTrigger delay={0} render={
                      <Button variant="ghost" size="icon">  
                        <Info className="size-4" />
                      </Button>
                    }>
                      
                    </TooltipTrigger>
                    <TooltipContent>{tooltipContent}</TooltipContent>
                  </Tooltip>
                ) : null}
              </FieldLabel>
            ) : null}

            {children ? (
              children({ field, fieldState })
            ) : (
              <Input {...field} aria-invalid={fieldState.invalid} />
            )}
          </div>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
