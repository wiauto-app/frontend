"use client";

import { useState } from "react";
import { Skeleton } from "./skeleton";
import { Popover, PopoverContent } from "./popover";
import { InputButton } from "./inputButton";
import { cn } from "@/lib/utils";

export function BaseSelect({
  label,
  options,
  isLoading,
}: {
  label: string;
  options: string[];
  isLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="relative">
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <InputButton
        asPopoverTrigger
        label={label}
        className="text-start"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selected ?? "Selecciona una opción"}
      </InputButton>
      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1"
        role="listbox"
      >
        {options.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">
            No hay opciones
          </p>
        ) : (
          options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={selected === option}
              className={cn(
                "flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus-visible:bg-muted",
                selected === option && "bg-muted font-medium",
              )}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}
