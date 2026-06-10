import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";
import { HTMLInputTypeAttribute } from "react";

import { cn, formatFieldLabel } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { PhoneInput, type PhoneFieldValue } from "./phoneInput";

type ControlledInputType = HTMLInputTypeAttribute | "phone" | "textarea";

const EMPTY_PHONE_VALUE: PhoneFieldValue = {
  phone_code: "",
  phone: "",
};

const normalizePhoneFieldValue = (value: unknown): PhoneFieldValue => {
  if (
    value &&
    typeof value === "object" &&
    "phone_code" in value &&
    "phone" in value
  ) {
    const phoneValue = value as PhoneFieldValue;
    return {
      phone_code: phoneValue.phone_code ?? "",
      phone: phoneValue.phone ?? "",
    };
  }

  return EMPTY_PHONE_VALUE;
};

type ControllerInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  showLabel?: boolean;
  optional?: boolean;
  orientation?: "vertical" | "horizontal";
  type?: ControlledInputType;
  children?: (props: {
    field: ControllerRenderProps<T, FieldPath<T>>;
    fieldState: ControllerFieldState;
  }) => React.ReactNode;
  placeholder?: string;
  rows?: number;
};

export const ControlledInput = <T extends FieldValues>({
  name,
  control,
  label,
  showLabel = true,
  type,
  placeholder,
  optional = false,
  children,
  orientation = "vertical",
  rows = 3,
}: ControllerInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          className="flex flex-col gap-1"
          data-invalid={fieldState.invalid}
          orientation={orientation}
        >
          {label ? (
            <FieldLabel className={cn(!showLabel && "sr-only")} htmlFor={name}>
              {formatFieldLabel(label, optional)}
            </FieldLabel>
          ) : null}

          {children ? (
            children({ field, fieldState })
          ) : type === "phone" ? (
            <PhoneInput
              value={normalizePhoneFieldValue(field.value)}
              onChange={field.onChange}
              ariaInvalid={fieldState.invalid}
            />
          ) : type === "textarea" ? (
            <Textarea
              id={name}
              placeholder={placeholder}
              rows={rows}
              aria-invalid={fieldState.invalid}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          ) : (
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              type={type}
            />
          )}

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
