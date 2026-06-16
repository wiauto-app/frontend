"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PriceUntilSelector } from "../selectors/priceUntilSelector";
import {
  HeroSearchFiltersProvider,
  useHeroSearchFilters,
} from "./HeroSearchFiltersContext";
import { HeroFiltersMakeSelector } from "./HeroFiltersMakeSelector";
import { HeroFiltersLocationSelector } from "./HeroFiltersLocationSelector";

const HeroSearchFormContent = () => {
  const router = useRouter();
  const { buildListingHref } = useHeroSearchFilters();
  const handleSearch = () => {
    router.push(buildListingHref());
  };

  return (
    <div className="w-full  rounded-b-2xl rounded-r-2xl bg-white p-6 shadow-2xl sm:p-7">
      <form
        className="grid grid-cols-5 gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <HeroFiltersMakeSelector />
        <HeroFiltersLocationSelector />
        <PriceUntilSelector />
        <div></div>
        <Button type="submit" className="h-full">
          Buscar autos
        </Button>
      </form>
    </div>
  );
};

export function HeroSearchForm() {
  return (
    <HeroSearchFiltersProvider>
      <HeroSearchFormContent />
    </HeroSearchFiltersProvider>
  );
}
