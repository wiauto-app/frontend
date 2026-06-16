import { yearsService } from "@/components/vehicles/services/yearsService";
import type { CatalogYearItem } from "@/components/vehicles/types/catalog.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { BaseSelector } from "./baseSelector";

type YearOption = CatalogYearItem & { label: string };

export const QuickYearSelector = ({
  value,
  onChange,
  modelId,
  ariaInvalid,
  disabled,
  placeholder = "Año",
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
  modelId?: number;
  ariaInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) => {
  const canFetch = Boolean(modelId);

  const { data, isLoading } = useQuery({
    queryKey: ["catalogYears", "quick", modelId],
    queryFn: () =>
      yearsService.findAll({
        model_id: modelId,
        page: 1,
        limit: 100,
        order_by: "year",
        order_direction: "DESC",
      }),
    enabled: canFetch,
  });

  const items = useMemo<YearOption[]>(
    () =>
      (data?.data ?? []).map((item) => ({
        ...item,
        label: String(item.year),
      })),
    [data?.data],
  );

  return (
    <Field data-invalid={ariaInvalid}>
      <FieldLabel htmlFor="quick-year-selector">Año</FieldLabel>
      {isLoading ? (
        <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground">
          Cargando años...
        </div>
      ) : (
        <BaseSelector
          items={items}
          value={value}
          onChange={(next_value) => onChange?.(next_value)}
          labelKey="label"
          valueKey="id"
          placeholder={placeholder}
          disabled={disabled || !canFetch}
          emptyLabel={
            !modelId ? "Selecciona un modelo primero" : "No hay años disponibles"
          }
        />
      )}
    </Field>
  );
};
