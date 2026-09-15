import { catalogVersionsService } from "@/components/vehicles/services/catalogVersionsService";
import type {
  CatalogVersionItem,
  CatalogVersionListItem,
} from "@/components/vehicles/types/catalog.types";
import { Field, FieldLabel } from "@/components/ui/field";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BaseSelector } from "./baseSelector";

interface VersionOption extends CatalogVersionListItem {
  label: string;
}

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
  const canFetch = Boolean(modelId);
  const { data, isLoading } = useQuery({
    queryKey: [
      "catalogVersions",
      makeId,
      modelId,
      bodyTypeId,
      fuelTypeId,
      yearId,
    ],
    queryFn: () =>
      catalogVersionsService.findAll({
        make_id: makeId,
        model_id: modelId,
        body_type_id: bodyTypeId,
        year_id: yearId,
        page: 1,
        limit: 100,
      }),
    enabled: canFetch,
  });

  const items = useMemo<VersionOption[]>(
    () =>
      (data?.data ?? []).map((item) => ({
        ...item,
        label: getVersionLabel(item),
      })),
    [data?.data],
  );

  const content = isLoading ? (
    <div
      className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground"
      aria-live="polite"
    >
      Cargando versiones...
    </div>
  ) : (
    <BaseSelector
      align="start"
      contentClassName="w-84"
      disabled={disabled || !canFetch}
      emptyLabel={
        !modelId
          ? "Selecciona un modelo primero"
          : !yearId
            ? "Selecciona un año primero"
            : "No hay versiones para esta combinación"
      }
      items={items}
      labelKey="label"
      onChange={(nextValue) => {
        const version = data?.data.find(
          (item) => Number(item.id) === Number(nextValue),
        );
        onChange?.(nextValue, version);
      }}
      placeholder={placeholder}
      renderItem={(item) => {
        const year = item.year?.year;
        if (!year) {
          return item.name;
        }

        return (
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="min-w-0 truncate">{item.name}</span>
            <span aria-hidden className="text-muted-foreground">
              -
            </span>
            <span className="shrink-0 text-muted-foreground tabular-nums">
              {year}
            </span>
          </span>
        );
      }}
      value={value}
      valueKey="id"
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
      <FieldLabel htmlFor="version-selector">Versión</FieldLabel>
      {content}
    </Field>
  );
};
