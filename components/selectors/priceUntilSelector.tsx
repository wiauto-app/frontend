"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useHeroSearchFilters } from "../home/HeroSearchFiltersContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formatCount = (count: number) =>
  count.toLocaleString("es-ES", { maximumFractionDigits: 0 });

export const PriceUntilSelector = () => {
  const { untilPrice, facetQueryParams, setUntilPrice } =
    useHeroSearchFilters();

  const { data: price_ranges = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "price_ranges", facetQueryParams],
    queryFn: () => heroFacetService.getPriceRanges(facetQueryParams),
  });




  if (isLoading && price_ranges.length === 0) {
    return (
      <div className="relative">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    );
  }

  return (
  
      <Select
        aria-label="Seleccionar precio hasta"
        items={price_ranges.map((item) => ({
          label: item.label,
          value: item.until_price.toString(),
        }))}
        value={untilPrice?.toString()}
        onValueChange={(value) => setUntilPrice(value ? Number(value) : undefined)}
      >
        <SelectTrigger className="w-full" aria-label="Seleccionar precio hasta">
          <SelectValue placeholder="Precio hasta" />
        </SelectTrigger>
        <SelectContent>
          {price_ranges.map((item) => (
            <SelectItem
              key={item.until_price}
              value={item.until_price.toString()}
            >
              <div className="flex-1 w-full flex items-center justify-between">
                {item.label} <span className="tabular-nums text-muted-foreground">{formatCount(item.vehicle_count)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
};
