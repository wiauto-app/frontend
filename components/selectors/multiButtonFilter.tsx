"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface MultiButtonFilterItem {
  key: string;
  label: React.ReactNode;
}

interface MultiButtonFilterProps {
  title?: string;
  items: MultiButtonFilterItem[];
  value: string[];
  onChange: (value: string[]) => void;
  selectionMode?: "multi" | "single";
  showAll?: boolean;
  allLabel?: string;
  className?: string;
  "aria-label"?: string;
}

export const MultiButtonFilter = ({
  title,
  items,
  value,
  onChange,
  selectionMode = "multi",
  showAll = true,
  allLabel = "Todos",
  className,
  "aria-label": ariaLabel,
}: MultiButtonFilterProps) => {
  const allSelected = value.length === 0;

  const handleClear = () => {
    onChange([]);
  };

  const handleToggle = (key: string) => {
    if (selectionMode === "single") {
      onChange(value.includes(key) ? [] : [key]);
      return;
    }

    if (value.includes(key)) {
      onChange(value.filter((item) => item !== key));
      return;
    }
    onChange([...value, key]);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title ? (
        <Label className="text-sm font-medium text-slate-600">{title}</Label>
      ) : null}
      <ButtonGroup className="w-full" aria-label={ariaLabel ?? title}>
        {showAll ? (
          <Button
            type="button"
            size="sm"
            variant={allSelected ? "default" : "outline"}
            className="flex-1"
            aria-pressed={allSelected}
            onClick={handleClear}
          >
            {allLabel}
          </Button>
        ) : null}
        {items.map((item) => {
          const isActive = value.includes(item.key);

          return (
            <Button
              key={item.key}
              type="button"
              size="sm"
              variant={isActive ? "default" : "outline"}
              className="flex-1"
              aria-pressed={isActive}
              onClick={() => handleToggle(item.key)}
            >
              {item.label}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
};
