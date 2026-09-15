"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const RADIUS_MIN = 0;
const RADIUS_MAX = 100;
const RADIUS_STEP = 10;
const RADIUS_DEBOUNCE_MS = 450;

interface RadiusSelectorProps {
  value?: number;
  disabled?: boolean;
  onChange: (value: number | undefined) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toSliderValue = (radius: number | undefined): number => {
  if (radius == null) {
    return RADIUS_MAX;
  }

  return clamp(radius, RADIUS_MIN, RADIUS_MAX);
};

export const RadiusSelector = ({
  value,
  disabled = false,
  onChange,
}: RadiusSelectorProps) => {
  const external_value = useMemo(() => toSliderValue(value), [value]);
  const [radius, setRadius] = useState(external_value);
  const debounced_radius = useDebouncedValue(radius, RADIUS_DEBOUNCE_MS);
  const last_emitted = useRef(external_value);

  useEffect(() => {
    last_emitted.current = external_value;
    setRadius((current) =>
      current === external_value ? current : external_value,
    );
  }, [external_value]);

  useEffect(() => {
    if (debounced_radius === last_emitted.current) {
      return;
    }

    last_emitted.current = debounced_radius;
    onChange(
      debounced_radius >= RADIUS_MAX ? undefined : debounced_radius,
    );
  }, [debounced_radius, onChange]);

  const handleValueChange = (next: number | readonly number[]) => {
    const next_value = Array.isArray(next) ? next[0] : next;
    if (!Number.isFinite(next_value)) {
      return;
    }
    setRadius(clamp(next_value, RADIUS_MIN, RADIUS_MAX));
  };

  const label =
    radius >= RADIUS_MAX ? "Sin límite" : `${radius} km`;

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>Radio</span>
        <span className="font-semibold text-primary">{label}</span>
      </div>
      <Slider
        aria-label="Radio de búsqueda en kilómetros"
        value={[radius]}
        min={RADIUS_MIN}
        max={RADIUS_MAX}
        step={RADIUS_STEP}
        disabled={disabled}
        onValueChange={handleValueChange}
      />
      <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-muted-foreground">
        <span>0 km</span>
        <span>Sin límite</span>
      </div>
    </div>
  );
};
