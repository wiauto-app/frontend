"use client";

import { useCallback } from "react";

import { CustomCheckbox } from "@/components/ui/customCheckbox";
import { CheckBoxContainer } from "@/components/ui/checkBoxContainer";

export type MultiCheckboxItem = {
  key: string;
  label: React.ReactNode;
};

type MultiCheckboxFilterProps = {
  title?: string;
  items: MultiCheckboxItem[];
  value: string[];
  onChange: (value: string[]) => void;
  showAll?: boolean;
};

export const MultiCheckboxFilter = ({
  title,
  items,
  value,
  onChange,
  showAll = true,
}: MultiCheckboxFilterProps) => {
  const allSelected = value.length === 0;

  const handleToggleAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const handleToggleItem = useCallback(
    (key: string) => {
      if (value.includes(key)) {
        onChange(value.filter((item) => item !== key));
        return;
      }
      onChange([...value, key]);
    },
    [onChange, value],
  );

  return (
    <CheckBoxContainer title={title}>
      {showAll ? (
        <CustomCheckbox
          label="Todos"
          checked={allSelected}
          onChange={() => handleToggleAll()}
        />
      ) : null}
      {items.map((item) => (
        <CustomCheckbox
          key={item.key}
          label={item.label}
          checked={value.includes(item.key)}
          onChange={() => handleToggleItem(item.key)}
        />
      ))}
    </CheckBoxContainer>
  );
};
