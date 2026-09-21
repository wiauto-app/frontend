"use client";

import { useId } from "react";
import { makesService } from "@/components/vehicles/services/makesService";
import { SearchSelect, type SearchSelectPageResult } from "@/components/ui/searchSelect";
import { Field, FieldLabel } from "@/components/ui/field";

const PAGE_SIZE = 40;

interface MakeSelectorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  ariaInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const MakeSelector = ({
  value,
  onChange,
  ariaInvalid,
  disabled,
  placeholder = "Marca",
}: MakeSelectorProps) => {
  const fieldId = useId();

  const searchMakes = async (
    query: string,
    page: number,
  ): Promise<SearchSelectPageResult> => {
    const response = await makesService.findAll({
      limit: PAGE_SIZE,
      page,
      search: query.trim() || undefined,
      order_by: "name",
      order_direction: "ASC",
    });

    const makes = response.data ?? [];

    return {
      options: makes.map((make) => ({
        label: make.name,
        value: String(make.id),
      })),
      total: response.total,
      page: response.page,
      limit: response.limit,
    };
  };

  return (
    <Field data-invalid={ariaInvalid}>
      <FieldLabel htmlFor={fieldId}>Marca</FieldLabel>
      <SearchSelect
        id={fieldId}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        searchPlaceholder="Buscar marca..."
        emptyText="No se encontraron marcas"
        searchPageFn={searchMakes}
        resolveOption={async (makeId) => {
          const make = await makesService.findOne(Number(makeId));
          return { label: make.name, value: String(make.id) };
        }}
        onChange={(nextValue) => onChange?.(nextValue)}
      />
    </Field>
  );
};
