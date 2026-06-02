"use client";

import { useState } from "react";

import type { NumericRangeValue } from "./types";
import { AutonomySelector } from "./autonomySelector";
import { BatteryCapacitySelector } from "./batteryCapacitySelector";

type ElectricSelectorProps = {
  autonomyValue?: number;
  onAutonomyChange?: (value?: number) => void;
  batteryValue?: NumericRangeValue;
  onBatteryChange?: (value: NumericRangeValue) => void;
};

export const ElectricSelector = ({
  autonomyValue: autonomyValueProp,
  onAutonomyChange,
  batteryValue: batteryValueProp,
  onBatteryChange,
}: ElectricSelectorProps) => {
  const [internalAutonomy, setInternalAutonomy] = useState<number | undefined>();
  const [internalBattery, setInternalBattery] = useState<NumericRangeValue>({});

  const autonomyValue = autonomyValueProp ?? internalAutonomy;
  const handleAutonomyChange = onAutonomyChange ?? setInternalAutonomy;
  const batteryValue = batteryValueProp ?? internalBattery;
  const handleBatteryChange = onBatteryChange ?? setInternalBattery;

  return (
    <div className="flex flex-col gap-8">
      <AutonomySelector value={autonomyValue} onChange={handleAutonomyChange} />
      <BatteryCapacitySelector value={batteryValue} onChange={handleBatteryChange} />
    </div>
  );
};
