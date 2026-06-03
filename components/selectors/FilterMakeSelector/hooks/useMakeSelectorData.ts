import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useMakeSelectorData = ( selectedMakes: HeroCatalogFacetItem[]) => {
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);

  const { data: makes = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "makes", selectedMakes.map(make => make.slug), debounced_search],
    queryFn: () =>
      heroFacetService.getMakes(
        undefined,
        debounced_search.trim() || undefined,
      ),
  });
  const { data: models = [], isLoading: isLoadingModels } = useQuery({
    queryKey: [
      "hero-facets",
      "models",
      selectedMakes.map(make => make.slug),
      // debounced_search,
    ],
    queryFn: () =>
      heroFacetService.getModels(
        selectedMakes.map(make => make.slug),
        undefined,
        // debounced_search.trim() || undefined,
      ),
    enabled: !!selectedMakes.length,
  });

  return {
    search,
    setSearch,
    makes,
    models,
    isLoading,
    isLoadingModels,
  };
};
