"use client";

import {
  PUBLISHER_TYPE,
  type PublisherType,
} from "@/interfaces/vehicle.interface";
import { toFilterStringArray } from "@/hooks/useFiltersManager";
import { MultiButtonFilter } from "./multiButtonFilter";
import type { PublisherTypesValue } from "./types";

const PUBLISHER_OPTIONS: { key: PublisherType; label: string }[] = [
  { key: PUBLISHER_TYPE.DEALERSHIP, label: "Concesionario" },
  { key: PUBLISHER_TYPE.PARTICULAR, label: "Particular" },
];

interface SellersSelectorProps {
  value: PublisherTypesValue | PublisherType | undefined;
  onChange: (value: PublisherTypesValue) => void;
}

export const SellersSelector = ({ value, onChange }: SellersSelectorProps) => {
  const selected = toFilterStringArray(value) as PublisherTypesValue;

  return (
    <MultiButtonFilter
      aria-label="Vendedores"
      items={PUBLISHER_OPTIONS.map((option) => ({
        key: option.key,
        label: option.label,
      }))}
      value={selected}
      onChange={(next) => {
        onChange(next as PublisherTypesValue);
      }}
    />
  );
};
