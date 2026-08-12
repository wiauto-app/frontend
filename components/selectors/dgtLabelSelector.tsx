"use client";

import { DgtLabel } from "@/interfaces/vehicle.interface";
import { MultiCheckboxFilter } from "./multiCheckboxFilter";

type DgtLabelSelectorProps = {
  dgtLabels: DgtLabel[];
  value: string[];
  onChange: (value: string[]) => void;
};

export const DgtLabelSelector = ({
  dgtLabels,
  value,
  onChange,
}: DgtLabelSelectorProps) => {
  return (
    <MultiCheckboxFilter
      items={dgtLabels.map((dgtLabel) => ({
        key: dgtLabel.id,
        label: dgtLabel.name,
      }))}
      value={value}
      onChange={onChange}
    />
  );
};
