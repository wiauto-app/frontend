"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { PaginatedResult } from "@/types/general.types";

export interface CatalogResourceSelectorProps<T> {
  queryKey: string[];
  fetchItems: () => Promise<PaginatedResult<T>>;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
  getItemValue: (item: T) => string;
  getItemLabel: (item: T) => string;
  /** Custom option content. Defaults to `getItemLabel(item)`. */
  renderItem?: (item: T) => ReactNode;
  /** Custom selected value in the trigger. Defaults to `getItemLabel(item)`. */
  renderSelectedValue?: (item: T) => ReactNode;
  triggerClassName?: string;
}

export const CatalogResourceSelector = <T,>({
  queryKey,
  fetchItems,
  value,
  onValueChange,
  placeholder,
  ariaInvalid,
  disabled = false,
  getItemValue,
  getItemLabel,
  renderItem,
  renderSelectedValue,
  triggerClassName,
}: CatalogResourceSelectorProps<T>) => {
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: fetchItems,
  });

  const items = data?.data ?? [];
  const resolvedPlaceholder = isLoading ? "Cargando..." : placeholder;
  const selectItems = items.map((item) => ({
    value: getItemValue(item),
    label: getItemLabel(item),
  }));

  const findItemByValue = (selectedValue: unknown): T | undefined => {
    if (typeof selectedValue !== "string" || !selectedValue) {
      return undefined;
    }

    return items.find((item) => getItemValue(item) === selectedValue);
  };

  return (
    <Select
      value={value ?? ""}
      onValueChange={(nextValue) => {
        if (nextValue != null) {
          onValueChange(nextValue);
        }
      }}
      disabled={disabled || isLoading}
      items={selectItems}
    >
      <SelectTrigger
        className={cn("w-full", triggerClassName)}
        aria-invalid={ariaInvalid}
      >
        <SelectValue placeholder={resolvedPlaceholder}>
          {(selectedValue) => {
            const selectedItem = findItemByValue(selectedValue);
            if (!selectedItem) {
              return (
                <span className="text-muted-foreground">{resolvedPlaceholder}</span>
              );
            }

            return (
              renderSelectedValue?.(selectedItem) ?? getItemLabel(selectedItem)
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {items.length === 0 ? (
          <SelectItem value="__empty__" disabled className="opacity-70">
            No hay opciones disponibles
          </SelectItem>
        ) : (
          items.map((item) => {
            const itemValue = getItemValue(item);
            return (
              <SelectItem key={itemValue} value={itemValue}>
                {renderItem?.(item) ?? getItemLabel(item)}
              </SelectItem>
            );
          })
        )}
      </SelectContent>
    </Select>
  );
};
