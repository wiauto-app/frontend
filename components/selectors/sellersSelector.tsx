"use client";

import {
  PUBLISHER_TYPE,
  type PublisherType,
} from "@/interfaces/vehicle.interface";
import { MultiCheckboxFilter } from "./multiCheckboxFilter";
import type { PublisherTypesValue } from "./types";

const PUBLISHER_OPTIONS: { key: PublisherType; label: string }[] = [
  { key: PUBLISHER_TYPE.PROFESSIONAL, label: "Profesional" },
  { key: PUBLISHER_TYPE.PARTICULAR, label: "Particular" },
];

type SellersSelectorProps = {
  value: PublisherTypesValue;
  onChange: (value: PublisherTypesValue) => void;
};

export const SellersSelector = ({ value, onChange }: SellersSelectorProps) => {
  return (
    <MultiCheckboxFilter
      title="Vendedores"
      items={PUBLISHER_OPTIONS.map((option) => ({
        key: option.key,
        label: option.label,
      }))}
      value={value ?? []}
      onChange={(next) => onChange(next as PublisherTypesValue)}
      showAll={false}
    />
  );
};
