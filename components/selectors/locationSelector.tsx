"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { HeroSearchFilters } from "@/interfaces/hero-facet.interface";
import { cn } from "@/lib/utils";

import {
  FilterProvinceSelector,
  type LocationFilterValue,
} from "./filterProvinceSelector";

export type { LocationFilterValue } from "./filterProvinceSelector";

type LocationSelectorProps = {
  value?: LocationFilterValue;
  onChange?: (value: LocationFilterValue) => void;
  facetQueryParams?: HeroSearchFilters;
};

const buildDisplayLabel = (value: LocationFilterValue): string | null => {
  if (value.province_name && value.municipality_name) {
    return `${value.province_name} · ${value.municipality_name}`;
  }
  if (value.province_name) {
    return value.province_name;
  }
  return null;
};

export const LocationSelector = ({
  value: valueProp,
  onChange,
  facetQueryParams,
}: LocationSelectorProps) => {
  const [internal_value, setInternalValue] = useState<LocationFilterValue>({});
  const value = valueProp ?? internal_value;
  const handleChange = onChange ?? setInternalValue;
  const display_label = buildDisplayLabel(value);

  return (
    <Popover >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "h-10 w-full justify-start gap-2 font-normal",
              !display_label && "text-muted-foreground",
            )}
          >
            <MapPin className="size-4 shrink-0" aria-hidden />
            {display_label ?? "Selecciona provincia o municipio"}
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-[min(100%,20rem)] p-3"
        sideOffset={8}
      >
        <FilterProvinceSelector
          value={value}
          onValueChange={handleChange}
          facetQueryParams={facetQueryParams}
        />
      </PopoverContent>
    </Popover>
  );
};
