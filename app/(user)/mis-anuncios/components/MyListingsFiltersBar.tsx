"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeSelector } from "@/components/date-range-selector/DateRangeSelector";
import {
  VEHICLE_STATUS_OPTIONS,
  type VehicleStatus,
} from "@/components/vehicles/constants/vehicle-status.constants";
import { MY_LISTINGS_ORDER_OPTIONS } from "../constants/my-listings-order.constants";
import { MyListingsMakeModelFilter } from "./MyListingsMakeModelFilter";
import type { MyListingsFilters } from "../hooks/useMyListingsPage";

const ALL_STATUS_VALUE = "all";

interface MyListingsFiltersBarProps {
  filters: MyListingsFilters;
  onChange: (patch: Partial<MyListingsFilters>) => void;
  onReset: () => void;
}

const hasActiveFilters = (filters: MyListingsFilters): boolean =>
  Boolean(
    filters.status ||
    filters.makeId ||
    filters.modelId ||
    filters.sinceCreatedAt ||
    filters.untilCreatedAt,
  );

export const MyListingsFiltersBar = ({
  filters,
  onChange,
  onReset,
}: MyListingsFiltersBarProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <MyListingsMakeModelFilter
          onMakeChange={(makeId) => onChange({ makeId, modelId: null })}
          onModelChange={(modelId) => onChange({ modelId })}
        />

        <Select
          value={filters.status ?? ALL_STATUS_VALUE}
          onValueChange={(value) =>
            onChange({
              status:
                value === ALL_STATUS_VALUE ? null : (value as VehicleStatus),
            })
          }
          items={VEHICLE_STATUS_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
        >
          <SelectTrigger
            className="w-full sm:w-40 border-gray-200 bg-white"
            aria-label="Filtrar por estado"
          >
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUS_VALUE}>Todos los estados</SelectItem>
            {VEHICLE_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.order}
          onValueChange={(value) => {
            if (value) {
              onChange({ order: value });
            }
          }}
          items={MY_LISTINGS_ORDER_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
        >
          <SelectTrigger
            className="w-full sm:w-48 border-gray-200 bg-white"
            aria-label="Ordenar anuncios"
          >
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {MY_LISTINGS_ORDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters(filters) ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="size-4" aria-hidden />
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">
          Antigüedad del anuncio
        </span>
        <DateRangeSelector
          startDate={filters.sinceCreatedAt}
          endDate={filters.untilCreatedAt}
          onStartDateChange={(value) => onChange({ sinceCreatedAt: value })}
          onEndDateChange={(value) => onChange({ untilCreatedAt: value })}
        />
      </div>
    </div>
  );
};
