"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PriceUntilSelector } from "../selectors/priceUntilSelector";
import {
  HeroSearchFiltersProvider,
  useHeroSearchFilters,
} from "./HeroSearchFiltersContext";
import { HeroFiltersMakeSelector } from "./HeroFiltersMakeSelector";
import { HeroFiltersModelSelector } from "./HeroFiltersModelSelector";
import { HeroFiltersLocationSelector } from "./HeroFiltersLocationSelector";
import { Card, CardContent } from "../ui/card";
import { NavbarPublishButton } from "../navbar/components/NavbarPublishButton";

const HeroSearchFormContent = () => {
  const router = useRouter();
  const { buildListingHref } = useHeroSearchFilters();
  const handleSearch = () => {
    router.push(buildListingHref());
  };

  return (
    <div className="min-w-xs space-y-2">
      <div className="grid grid-cols-2  gap-1 p-1 bg-white rounded-xl w-full lg:w-fit">
        <Button className="rounded-lg">Comprar</Button>
        <NavbarPublishButton variant="outline" className="rounded-lg"/>
      </div>
      <Card size="sm" className="w-full">
        <CardContent>
          <form
            className="grid grid-cols-1 gap-3 "
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <HeroFiltersMakeSelector />
            <HeroFiltersModelSelector />
            <HeroFiltersLocationSelector />
            <PriceUntilSelector />
            <Button type="submit">Buscar autos</Button>
          </form>
        </CardContent>
      </Card>
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
