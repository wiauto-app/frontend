"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VehicleFormValues } from "./form-values";

interface TypeAttributeTextFieldProps {
  name: keyof NonNullable<VehicleFormValues["type_attributes"]>;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "date";
}

export const TypeAttributeTextField = ({
  name,
  label,
  placeholder,
  type = "text",
}: TypeAttributeTextFieldProps) => {
  const form = useFormContext<VehicleFormValues>();

  return (
    <Controller
      name={`type_attributes.${name}`}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`type-attr-${name}`}>{label}</FieldLabel>
          <Input
            id={`type-attr-${name}`}
            type={type}
            placeholder={placeholder}
            value={field.value == null ? "" : String(field.value)}
            onChange={(event) => {
              const raw = event.target.value;
              if (type === "number") {
                field.onChange(raw === "" ? undefined : Number(raw));
                return;
              }
              field.onChange(raw);
            }}
            onBlur={field.onBlur}
            ref={field.ref}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.error ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
};

interface TypeAttributeSelectFieldProps {
  name: keyof NonNullable<VehicleFormValues["type_attributes"]>;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const TypeAttributeSelectField = ({
  name,
  label,
  options,
  placeholder = "Selecciona…",
}: TypeAttributeSelectFieldProps) => {
  const form = useFormContext<VehicleFormValues>();

  return (
    <Controller
      name={`type_attributes.${name}`}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <Select
            value={field.value ? String(field.value) : undefined}
            onValueChange={field.onChange}
          >
            <SelectTrigger aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
};

interface FreeTextIdentityFieldsProps {
  showTitle?: boolean;
  showMakeModel?: boolean;
}

export const FreeTextIdentityFields = ({
  showTitle = false,
  showMakeModel = false,
}: FreeTextIdentityFieldsProps) => {
  const form = useFormContext<VehicleFormValues>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {showTitle ? (
        <div className="md:col-span-2">
          <ControllerInput name="title" control={form.control} label="Título del anuncio">
            {({ field, fieldState }) => (
              <Input
                {...field}
                value={String(field.value ?? "")}
                placeholder="Ej. Autocaravana familiar 2020"
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
        </div>
      ) : null}
      {showMakeModel ? (
        <>
          <ControllerInput name="make_name" control={form.control} label="Marca">
            {({ field, fieldState }) => (
              <Input
                {...field}
                value={String(field.value ?? "")}
                placeholder="Ej. Mercedes-Benz"
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
          <ControllerInput name="model_name" control={form.control} label="Modelo">
            {({ field, fieldState }) => (
              <Input
                {...field}
                value={String(field.value ?? "")}
                placeholder="Ej. Sprinter"
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
        </>
      ) : null}
    </div>
  );
};
