"use client";

import { useId } from "react";
import {
  SearchSelect,
  type SearchSelectPageResult,
} from "@/components/ui/searchSelect";
import { modelService } from "../vehicles/services/modelService";
import { Field, FieldLabel } from "@/components/ui/field";

const PAGE_SIZE = 40;

interface ModelSelectorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  ariaInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  makeId?: number;
}

export const ModelSelector = ({
  value,
  onChange,
  ariaInvalid,
  disabled,
  placeholder = "Modelo",
  makeId,
}: ModelSelectorProps) => {
  const fieldId = useId();

  const searchModels = async (
    query: string,
    page: number,
  ): Promise<SearchSelectPageResult> => {
    if (!makeId) {
      return { options: [], total: 0, page: 1, limit: PAGE_SIZE };
    }

    const response = await modelService.findAll({
      limit: PAGE_SIZE,
      page,
      search: query.trim() || undefined,
      make_id: makeId,
      order_by: "name",
      order_direction: "ASC",
    });

    const models = response.data ?? [];

    return {
      options: models.map((model) => ({
        label: model.name,
        value: String(model.id),
      })),
      total: response.total,
      page: response.page,
      limit: response.limit,
    };
  };

  return (
    <Field data-invalid={ariaInvalid}>
      <FieldLabel htmlFor={fieldId}>Modelo</FieldLabel>
      <SearchSelect
        id={fieldId}
        value={value}
        disabled={disabled || !makeId}
        onChange={(nextValue) => onChange?.(nextValue)}
        placeholder={placeholder ?? "Seleccionar modelo"}
        searchPlaceholder="Buscar modelo"
        emptyText={
          !makeId ? "Selecciona una marca primero" : "No se encontraron modelos"
        }
        searchKey={makeId}
        searchPageFn={searchModels}
        resolveOption={async (modelId) => {
          const model = await modelService.findOne(Number(modelId));
          return { label: model.name, value: String(model.id) };
        }}
      />
    </Field>
  );
};
