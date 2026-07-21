"use client";

import {
  TRANSMISSION_TYPE,
  type FuelType,
  type Traction,
} from "@/interfaces/vehicle.interface";
import { MultiCheckboxFilter } from "./multiCheckboxFilter";
import type { MultiSlugValue, TransmissionTypesValue } from "./types";

type EngineSelectorProps = {
  fuelTypes: FuelType[];
  tractions: Traction[];
  fuelTypeSlugs: MultiSlugValue;
  onFuelTypeSlugsChange: (value: MultiSlugValue) => void;
  tractionSlugs: MultiSlugValue;
  onTractionSlugsChange: (value: MultiSlugValue) => void;
  transmissionTypes: TransmissionTypesValue;
  onTransmissionTypesChange: (value: TransmissionTypesValue) => void;
};

const TRANSMISSION_OPTIONS = [
  { key: TRANSMISSION_TYPE.MANUAL, label: "Manual" },
  { key: TRANSMISSION_TYPE.AUTOMATIC, label: "Automático" },
] as const;

export const EngineSelector = ({
  fuelTypes,
  tractions,
  fuelTypeSlugs,
  onFuelTypeSlugsChange,
  tractionSlugs,
  onTractionSlugsChange,
  transmissionTypes,
  onTransmissionTypesChange,
}: EngineSelectorProps) => {
  return (
    <div className="flex flex-col gap-8">
      <MultiCheckboxFilter
        title="Transmisión"
        items={TRANSMISSION_OPTIONS.map((option) => ({
          key: option.key,
          label: option.label,
        }))}
        value={transmissionTypes}
        onChange={(next) =>
          onTransmissionTypesChange(next as TransmissionTypesValue)
        }
      />
      <MultiCheckboxFilter
        title="Tipo de combustible"
        items={fuelTypes.map((fuelType) => ({
          key: fuelType.slug,
          label: fuelType.name,
        }))}
        value={fuelTypeSlugs}
        onChange={onFuelTypeSlugsChange}
      />
      <MultiCheckboxFilter
        title="Tracción"
        items={tractions.map((traction) => ({
          key: traction.slug,
          label: traction.name,
        }))}
        value={tractionSlugs}
        onChange={onTractionSlugsChange}
      />
    </div>
  );
};
