"use client";

import {
  CONDITION_VEHICLE,
  type ConditionVehicle,
} from "@/interfaces/vehicle.interface";
import { MultiButtonFilter } from "./multiButtonFilter";

const CONDITION_OPTIONS: { key: ConditionVehicle; label: string }[] = [
  { key: CONDITION_VEHICLE.NEW, label: "Nuevo" },
  { key: CONDITION_VEHICLE.USED, label: "Usado" },
];

interface ConditionSelectorProps {
  value?: ConditionVehicle;
  onChange: (value?: ConditionVehicle) => void;
}

export const ConditionSelector = ({
  value,
  onChange,
}: ConditionSelectorProps) => {
  return (
    <MultiButtonFilter
      aria-label="Estado"
      selectionMode="single"
      showAll
      items={CONDITION_OPTIONS.map((option) => ({
        key: option.key,
        label: option.label,
      }))}
      value={value ? [value] : []}
      onChange={(next) => {
        const selected = next[0] as ConditionVehicle | undefined;
        onChange(selected);
      }}
    />
  );
};
