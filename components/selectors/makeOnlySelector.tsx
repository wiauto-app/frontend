"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useMakeSelectorData } from "@/components/selectors/FilterMakeSelector/hooks/useMakeSelectorData";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import { MakeLogoQuickBadges } from "./MakeLogoQuickBadges";
import type { MakeLogoBadgeItem } from "./utils/build-make-logo-badges";

export interface MakeOnlySelectorProps {
  showQuickBadges?: boolean;
  quickBadgeLimit?: number;
  quickBadgeMakes?: MakeLogoBadgeItem[];
  placeholder?: string;
  onNavigate?: (href: string) => void;
}

export const MakeOnlySelector = ({
  showQuickBadges = false,
  quickBadgeLimit = 9,
  quickBadgeMakes = [],
  placeholder = "Selecciona una marca",
  onNavigate,
}: MakeOnlySelectorProps) => {
  const router = useRouter();
  const { makes, isLoading, search, setSearch } = useMakeSelectorData([]);

  const handleNavigate = useCallback(
    (href: string) => {
      if (onNavigate) {
        onNavigate(href);
        return;
      }
      router.push(href);
    },
    [onNavigate, router],
  );

  const handleSelectMake = (slug: string) => {
    handleNavigate(buildVehicleListingHref({ makes_slugs: [slug] }));
  };

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" className="w-full justify-start text-base">
              <div className="flex w-full items-center justify-between text-sm">
                {placeholder}
                <ChevronDown className="size-4 shrink-0 opacity-50" />
              </div>
            </Button>
          }
        />
        <PopoverContent
          align="start"
          className="flex max-h-80 flex-col gap-2 overflow-y-scroll"
        >
          <SearchInput
            placeholder="Buscar marca"
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8 w-full rounded-sm bg-muted-foreground/20"
                />
              ))}
            </div>
          )}
          {!isLoading &&
            makes.map((make) => (
              <button
                key={make.id}
                type="button"
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => handleSelectMake(make.slug)}
                aria-label={`Filtrar por ${make.name}`}
              >
                <span>{make.name}</span>
                <span className="text-xs text-muted-foreground">
                  {make.vehicle_count.toLocaleString("es-ES")}
                </span>
              </button>
            ))}
        </PopoverContent>
      </Popover>
      {showQuickBadges ? (
        <MakeLogoQuickBadges makes={quickBadgeMakes} limit={quickBadgeLimit} />
      ) : null}
    </div>
  );
};
