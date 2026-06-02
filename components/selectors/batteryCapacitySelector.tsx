"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckBoxContainer } from "@/components/ui/checkBoxContainer";
import type { NumericRangeValue } from "./types";
import { BATTERY_KWH_OPTIONS, formatBatteryLabel } from "./filter-range-options";

type BatteryCapacitySelectorProps = {
  value: NumericRangeValue;
  onChange: (value: NumericRangeValue) => void;
};

const batterySelectItems = BATTERY_KWH_OPTIONS.map((kwh) => ({
  label: formatBatteryLabel(kwh),
  value: kwh.toString(),
}));

export const BatteryCapacitySelector = ({
  value,
  onChange,
}: BatteryCapacitySelectorProps) => {
  const handleSinceChange = (raw: string | null) => {
    onChange({
      ...value,
      since: raw ? Number(raw) : undefined,
    });
  };

  const handleUntilChange = (raw: string | null) => {
    onChange({
      ...value,
      until: raw ? Number(raw) : undefined,
    });
  };

  return (
    <CheckBoxContainer title="Capacidad de batería">
      <div className="flex flex-col gap-2">
        <Select
          value={value.since?.toString() ?? ""}
          onValueChange={handleSinceChange}
          items={batterySelectItems}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Desde" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {BATTERY_KWH_OPTIONS.map((kwh) => (
              <SelectItem key={kwh} value={kwh.toString()}>
                {formatBatteryLabel(kwh)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={value.until?.toString() ?? ""}
          onValueChange={handleUntilChange}
          items={batterySelectItems}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Hasta" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {BATTERY_KWH_OPTIONS.map((kwh) => (
              <SelectItem key={kwh} value={kwh.toString()}>
                {formatBatteryLabel(kwh)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CheckBoxContainer>
  );
};
