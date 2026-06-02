"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type FilterOptionListItem = {
  value: number;
  label: string;
};

type FilterOptionListProps = {
  options: FilterOptionListItem[];
  value?: number;
  onChange: (value?: number) => void;
  desdeLabel?: string;
  className?: string;
};

export const FilterOptionList = ({
  options,
  value,
  onChange,
  desdeLabel = "Desde",
  className,
}: FilterOptionListProps) => {
  const isDesdeSelected = value === undefined;

  const handleSelectDesde = () => {
    onChange(undefined);
  };

  const handleSelectOption = (optionValue: number) => {
    onChange(optionValue);
  };

  const handleKeyDownDesde = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectDesde();
    }
  };

  const handleKeyDownOption = (
    event: React.KeyboardEvent<HTMLDivElement>,
    optionValue: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectOption(optionValue);
    }
  };

  return (
    <ul className={cn("flex flex-col divide-y divide-slate-100", className)}>
      <li>
        <div
          role="button"
          tabIndex={0}
          aria-selected={isDesdeSelected}
          onClick={handleSelectDesde}
          onKeyDown={handleKeyDownDesde}
          className={cn(
            "flex cursor-pointer items-center justify-between px-1 py-3 transition-colors hover:bg-slate-50",
            isDesdeSelected && "bg-primary/5",
          )}
        >
          <span
            className={cn(
              "text-sm text-slate-800",
              isDesdeSelected && "font-bold text-primary",
            )}
          >
            {desdeLabel}
          </span>
          {isDesdeSelected ? (
            <Check className="size-5 text-primary" aria-hidden />
          ) : null}
        </div>
      </li>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <li key={option.value}>
            <div
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
              onClick={() => handleSelectOption(option.value)}
              onKeyDown={(event) => handleKeyDownOption(event, option.value)}
              className={cn(
                "flex cursor-pointer items-center justify-between px-1 py-3 transition-colors hover:bg-slate-50",
                isSelected && "bg-primary/5",
              )}
            >
              <span
                className={cn(
                  "text-sm text-slate-800",
                  isSelected && "font-semibold text-primary",
                )}
              >
                {option.label}
              </span>
              {isSelected ? (
                <Check className="size-5 text-primary" aria-hidden />
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
