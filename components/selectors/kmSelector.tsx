"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { NumericRangeValue } from "./types";

const KM_OPTIONS = [
  2500, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
  60000, 70000, 80000, 90000, 100000, 120000, 140000, 160000, 180000, 200000,
];

type KmSelectorProps = {
  value: NumericRangeValue;
  onChange: (value: NumericRangeValue) => void;
};

export const KmSelector = ({ value, onChange }: KmSelectorProps) => {
  const kmItems = KM_OPTIONS.map((km) => ({
    label: `${km.toLocaleString()} km`,
    value: km.toString(),
  }));

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={value.since?.toString() ?? ""}
        onValueChange={(raw) =>
          onChange({ ...value, since: raw ? Number(raw) : undefined })
        }
        items={kmItems}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Desde" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {KM_OPTIONS.map((km) => (
            <SelectItem key={km} value={km.toString()}>
              {km.toLocaleString()} km
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={value.until?.toString() ?? ""}
        onValueChange={(raw) =>
          onChange({ ...value, until: raw ? Number(raw) : undefined })
        }
        items={kmItems}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Hasta" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {KM_OPTIONS.map((km) => (
            <SelectItem key={km} value={km.toString()}>
              {km.toLocaleString()} km
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
