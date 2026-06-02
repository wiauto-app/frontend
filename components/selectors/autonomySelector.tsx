"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckBoxContainer } from "@/components/ui/checkBoxContainer";
import {
  AUTONOMY_KM_OPTIONS,
  formatAutonomyLabel,
} from "./filter-range-options";

type AutonomySelectorProps = {
  value?: number;
  onChange: (value?: number) => void;
};

const autonomySelectItems = AUTONOMY_KM_OPTIONS.map((km) => ({
  label: formatAutonomyLabel(km),
  value: km.toString(),
}));

export const AutonomySelector = ({ value, onChange }: AutonomySelectorProps) => {
  const handleValueChange = (raw: string | null) => {
    onChange(raw ? Number(raw) : undefined);
  };

  return (
    <CheckBoxContainer title="Autonomía eléctrica">
      <Select
        value={value?.toString() ?? ""}
        onValueChange={handleValueChange}
        items={autonomySelectItems}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Desde" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {AUTONOMY_KM_OPTIONS.map((km) => (
            <SelectItem key={km} value={km.toString()}>
              {formatAutonomyLabel(km)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CheckBoxContainer>
  );
};
