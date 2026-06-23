"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent } from "../ui/popover";
import { InputButton } from "../ui/inputButton";
import { cn } from "@/lib/utils";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useHeroSearchFilters } from "../home/HeroSearchFiltersContext";
import type { HeroPriceRangeFacetItem } from "@/interfaces/hero-facet.interface";
import { ChevronDown } from "lucide-react";

const formatCount = (count: number) =>
  count.toLocaleString("es-ES", { maximumFractionDigits: 0 });

export const PriceUntilSelector = () => {
  const { untilPrice, facetQueryParams, setUntilPrice } =
    useHeroSearchFilters();
  const [is_open, setIsOpen] = useState(false);

  const { data: price_ranges = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "price_ranges", facetQueryParams],
    queryFn: () => heroFacetService.getPriceRanges(facetQueryParams),
  });

  const displayValue = useMemo(() => {
    if (untilPrice === undefined) {
      return null;
    }
    const selected = price_ranges.find(
      (item) => item.until_price === untilPrice,
    );
    return selected?.label ?? `Hasta ${formatCount(untilPrice)} €`;
  }, [untilPrice, price_ranges]);

  const handleSelect = (item: HeroPriceRangeFacetItem) => {
    setUntilPrice(item.until_price);
    setIsOpen(false);
  };

  if (isLoading && price_ranges.length === 0) {
    return (
      <div className="relative">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <Popover open={is_open} onOpenChange={setIsOpen}>
      <InputButton
        asPopoverTrigger
        className={cn(
          "h-11 text-start text-base",
          displayValue ? "text-foreground" : undefined,
        )}
        aria-expanded={is_open}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between w-full text-sm ">
          {displayValue ?? "Precio hasta"}
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </div>
      </InputButton>
      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1"
        role="listbox"
        aria-label="Precio hasta"
      >
        {price_ranges.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">
            No hay rangos disponibles
          </p>
        ) : (
          price_ranges.map((item) => (
            <button
              key={item.until_price}
              type="button"
              role="option"
              aria-selected={untilPrice === item.until_price}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted focus-visible:bg-muted",
                untilPrice === item.until_price && "bg-muted font-medium",
              )}
              onClick={() => handleSelect(item)}
            >
              <span>{item.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {formatCount(item.vehicle_count)}
              </span>
            </button>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};
