"use client";

import { Color } from "@/interfaces/vehicle.interface";
import { MultiCheckboxFilter } from "./multiCheckboxFilter";
import type { MultiSlugValue } from "./types";

type ColorSelectorProps = {
  colors: Color[];
  value: MultiSlugValue;
  onChange: (value: MultiSlugValue) => void;
};

export const ColorSelector = ({ colors, value, onChange }: ColorSelectorProps) => {
  return (
    <MultiCheckboxFilter
      title="Color"
      items={colors.map((color) => ({
        key: color.slug,
        label: (
          <span className="flex items-center gap-2">
            <span
              className="size-4 rounded-full border border-slate-200"
              style={{ backgroundColor: color.hex_code }}
            />
            {color.name}
          </span>
        ),
      }))}
      value={value}
      onChange={onChange}
    />
  );
};
