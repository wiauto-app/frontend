"use client";

import { Feature } from "@/interfaces/vehicle.interface";
import { MultiCheckboxFilter } from "./multiCheckboxFilter";
import type { MultiSlugValue } from "./types";

type FeaturesSelectorProps = {
  features: Feature[];
  value: MultiSlugValue;
  onChange: (value: MultiSlugValue) => void;
};

export const FeaturesSelector = ({
  features,
  value,
  onChange,
}: FeaturesSelectorProps) => {
  return (
    <MultiCheckboxFilter
      title="Equipamiento"
      items={features.map((feature) => ({
        key: feature.slug,
        label: feature.name,
      }))}
      value={value}
      onChange={onChange}
    />
  );
};
