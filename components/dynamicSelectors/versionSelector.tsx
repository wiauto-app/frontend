"use client";

import { useEffect, useId, useRef } from "react";
import { catalogVersionsService } from "@/components/vehicles/services/catalogVersionsService";
import type {
  CatalogVersionItem,
  CatalogVersionListItem,
} from "@/components/vehicles/types/catalog.types";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  SearchSelect,
  type SearchSelectPageResult,
  type SelectOption,
} from "@/components/ui/searchSelect";

interface VersionSelectorProps {
  makeId?: number;
  value?: string;
  onChange?: (value: string | undefined, version?: CatalogVersionItem) => void;
  modelId?: number;
  fuelTypeId?: number;
  yearId?: number;
  bodyTypeId?: number;
  ariaInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Si true, no se muestra `FieldLabel` (útil cuando el padre ya tiene label, p. ej. react-hook-form). */
  hideLabel?: boolean;
}

const PAGE_SIZE = 40;

const getVersionLabel = (item: CatalogVersionListItem) => {
  const year = item.year?.year;
  return year ? `${item.name} - ${year}` : item.name;
};

export const VersionSelector = ({
  makeId,
  value,
  onChange,
  modelId,
  fuelTypeId,
  bodyTypeId,
  yearId,
  ariaInvalid,
  disabled,
  placeholder = "Versión",
  hideLabel = false,
}: VersionSelectorProps) => {
  const fieldId = useId();
  const canFetch = Boolean(modelId);
  const versionsByIdRef = useRef<Map<string, CatalogVersionListItem>>(new Map());

  useEffect(() => {
    versionsByIdRef.current = new Map();
  }, [makeId, modelId, bodyTypeId, fuelTypeId, yearId]);

  const searchVersions = async (
    query: string,
    page: number,
  ): Promise<SearchSelectPageResult> => {
    if (!modelId) {
      return { options: [], total: 0, page: 1, limit: PAGE_SIZE };
    }

    const response = await catalogVersionsService.findAll({
      make_id: makeId,
      model_id: modelId,
      body_type_id: bodyTypeId,
      fuel_type_id: fuelTypeId,
      year_id: yearId,
      page,
      limit: PAGE_SIZE,
      search: query.trim() || undefined,
      order_by: "name",
      order_direction: "ASC",
    });

    const options: SelectOption[] = (response.data ?? []).map((item) => {
      versionsByIdRef.current.set(String(item.id), item);
      return {
        label: getVersionLabel(item),
        value: String(item.id),
      };
    });

    return {
      options,
      total: response.total,
      page: response.page,
      limit: response.limit,
    };
  };

  const content = (
    <SearchSelect
      id={fieldId}
      disabled={disabled || !canFetch}
      emptyText={
        !modelId
          ? "Selecciona un modelo primero"
          : "No hay versiones para esta combinación"
      }
      placeholder={placeholder}
      resolveOption={async (versionId) => {
        const version = await catalogVersionsService.findOne(Number(versionId));
        versionsByIdRef.current.set(String(version.id), version);
        return {
          label: version.name,
          value: String(version.id),
        };
      }}
      searchKey={[makeId, modelId, bodyTypeId, fuelTypeId, yearId]}
      searchPageFn={searchVersions}
      searchPlaceholder="Buscar versión..."
      value={value}
      onChange={(nextValue, option) => {
        const version =
          versionsByIdRef.current.get(option.value) ??
          versionsByIdRef.current.get(nextValue);
        onChange?.(nextValue, version);
      }}
    />
  );

  if (hideLabel) {
    return (
      <div className="w-full" data-invalid={ariaInvalid}>
        {content}
      </div>
    );
  }

  return (
    <Field data-invalid={ariaInvalid}>
      <FieldLabel htmlFor={fieldId}>Versión</FieldLabel>
      {content}
    </Field>
  );
};
