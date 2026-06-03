import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { heroFacetService } from "@/services/search/heroFacetService";

export const useLocationSelectorData = (
  selectedProvinces: HeroCatalogFacetItem[],
) => {
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "provinces", debounced_search],
    queryFn: () =>
      heroFacetService.getProvinces(
        {},
        debounced_search.trim() || undefined,
      ),
  });

  const { data: municipalities = [], isLoading: isLoadingMunicipalities } =
    useQuery({
      queryKey: [
        "hero-facets",
        "municipalities",
        selectedProvinces.map((province) => province.slug),
      ],
      queryFn: async () => {
        const batches = await Promise.all(
          selectedProvinces.map(async (province) => {
            const items = await heroFacetService.getMunicipalities(
              province.slug,
              {},
            );
            return items.map((item) => ({
              ...item,
              province_id: province.id,
            }));
          }),
        );
        return batches.flat();
      },
      enabled: selectedProvinces.length > 0,
    });

  return {
    search,
    setSearch,
    provinces,
    municipalities,
    isLoading,
    isLoadingMunicipalities,
  };
};
