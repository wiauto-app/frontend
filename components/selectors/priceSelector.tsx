"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import type { PriceFilterValue } from "./types";

const PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 100_000;
const PRICE_STEP = 1_000;
const PRICE_DEBOUNCE_MS = 450;

type PriceRange = [number, number];

type PriceSelectorProps = {
  value: PriceFilterValue;
  onChange: (value: PriceFilterValue) => void;
};

const price_formatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const resolveSliderMax = (since?: number, until?: number): number => {
  const selected_max = Math.max(since ?? 0, until ?? 0);
  if (selected_max <= DEFAULT_PRICE_MAX) {
    return DEFAULT_PRICE_MAX;
  }
  return Math.ceil(selected_max / 10_000) * 10_000;
};

const toSliderRange = (
  since_value: number | undefined,
  until_value: number | undefined,
  slider_max: number,
): PriceRange => {
  const since = clamp(since_value ?? PRICE_MIN, PRICE_MIN, slider_max);
  const until = clamp(until_value ?? slider_max, since, slider_max);
  return [since, until];
};

const rangeKey = ([since, until]: PriceRange) => `${since}:${until}`;

export const PriceSelector = ({ value, onChange }: PriceSelectorProps) => {
  const since_value = value.since;
  const until_value = value.until;
  const slider_max = useMemo(
    () => resolveSliderMax(since_value, until_value),
    [since_value, until_value],
  );
  const external_range = useMemo(
    () => toSliderRange(since_value, until_value, slider_max),
    [since_value, slider_max, until_value],
  );
  const [range, setRange] = useState<PriceRange>(external_range);
  const debounced_range = useDebouncedValue(range, PRICE_DEBOUNCE_MS);
  const last_emitted_key = useRef(rangeKey(external_range));

  useEffect(() => {
    const next_key = rangeKey(external_range);
    last_emitted_key.current = next_key;
    setRange((current) =>
      rangeKey(current) === next_key ? current : external_range,
    );
  }, [external_range]);

  useEffect(() => {
    const next_key = rangeKey(debounced_range);
    if (next_key === last_emitted_key.current) {
      return;
    }

    last_emitted_key.current = next_key;
    onChange({
      since:
        debounced_range[0] === PRICE_MIN ? undefined : debounced_range[0],
      until:
        debounced_range[1] === slider_max
          ? undefined
          : debounced_range[1],
      cuota_slug: undefined,
    });
  }, [debounced_range, onChange, slider_max]);

  const handleValueChange = (next: number | readonly number[]) => {
    if (!Array.isArray(next) || next.length < 2) {
      return;
    }
    const since = next[0];
    const until = next[1];
    if (!Number.isFinite(since) || !Number.isFinite(until)) {
      return;
    }
    setRange([since, until]);
  };

  return (
    <div className="flex flex-col gap-5 py-1">
      {/* <div className="grid grid-cols-2 gap-3">
        <div className="flex min-w-0 flex-col gap-1 rounded-lg border bg-muted/35 px-3 py-2.5">
          <span className="text-xs text-muted-foreground">Mínimo</span>
          <span className="truncate text-sm font-semibold tabular-nums">
            {range[0] === PRICE_MIN
              ? "Sin mínimo"
              : price_formatter.format(range[0])}
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-1 rounded-lg border bg-muted/35 px-3 py-2.5 text-right">
          <span className="text-xs text-muted-foreground">Máximo</span>
          <span className="truncate text-sm font-semibold tabular-nums">
            {range[1] === slider_max
              ? "Sin máximo"
              : price_formatter.format(range[1])}
          </span>
        </div>
      </div> */}

      <Slider
        aria-label="Rango de precio"
        value={range}
        min={PRICE_MIN}
        max={slider_max}
        step={PRICE_STEP}
        onValueChange={handleValueChange}
      />

      <div className="flex items-center justify-between gap-3 text-xs tabular-nums text-muted-foreground">
        <span>{price_formatter.format(PRICE_MIN)}</span>
        <span>{price_formatter.format(slider_max)}+</span>
      </div>
    </div>
  );
};
