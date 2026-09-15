"use client";

import { Feature } from "@/interfaces/vehicle.interface";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import { CheckBoxContainer } from "@/components/ui/checkBoxContainer";
import { GroupedFeaturesAccordion } from "@/components/vehicles/GroupedFeaturesAccordion";
import type { MultiSlugValue } from "./types";

interface FeaturesSelectorProps {
  features: Feature[];
  value: MultiSlugValue;
  onChange: (value: MultiSlugValue) => void;
}

export const FeaturesSelector = ({
  features,
  value,
  onChange,
}: FeaturesSelectorProps) => {
  const allSelected = value.length === 0;

  const handleToggleAll = () => {
    onChange([]);
  };

  const handleToggleItem = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((item) => item !== key));
      return;
    }

    onChange([...value, key]);
  };

  return (
    <CheckBoxContainer>
      <GroupedFeaturesAccordion
        features={features}
        selectedKeys={value}
        getItemKey={(feature) => feature.slug}
        accordionMode="collapsed"
        leadingContent={
          <CustomCheckbox
            label="Todos"
            checked={allSelected}
            onChange={handleToggleAll}
          />
        }
        renderItems={(groupFeatures) => (
          <div className="flex flex-col gap-1">
            {groupFeatures.map((feature) => (
              <CustomCheckbox
                key={feature.slug}
                label={feature.name}
                checked={value.includes(feature.slug)}
                onChange={() => handleToggleItem(feature.slug)}
              />
            ))}
          </div>
        )}
      />
    </CheckBoxContainer>
  );
};
