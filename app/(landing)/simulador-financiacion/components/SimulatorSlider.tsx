"use client";

import { Slider } from "@/components/ui/slider";

interface SimulatorSliderProps {
  label: string;
  valueStr: string;
  minStr: string;
  maxStr: string;
  sliderValue: number;
  sliderMin: number;
  sliderMax: number;
  step: number;
  onValueChange: (value: number) => void;
}

const resolveSliderNumber = (value: number | readonly number[]): number | undefined => {
  const next = Array.isArray(value) ? value[0] : value;
  if (typeof next !== "number" || !Number.isFinite(next)) {
    return undefined;
  }
  return next;
};

export const SimulatorSlider = ({
  label,
  valueStr,
  minStr,
  maxStr,
  sliderValue,
  sliderMin,
  sliderMax,
  step,
  onValueChange,
}: SimulatorSliderProps) => {
  const handleValueChange = (value: number | readonly number[]) => {
    const next = resolveSliderNumber(value);
    if (next === undefined) {
      return;
    }
    onValueChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{valueStr}</span>
      </div>
      <Slider
        value={[sliderValue]}
        min={sliderMin}
        max={sliderMax}
        step={step}
        onValueChange={handleValueChange}
        aria-label={label}
      />
      <div className="flex justify-between text-[11px] font-medium text-slate-400">
        <span>{minStr}</span>
        <span>{maxStr}</span>
      </div>
    </div>
  );
};
