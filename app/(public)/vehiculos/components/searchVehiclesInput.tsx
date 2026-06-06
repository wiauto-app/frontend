"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { vehicleService } from "@/services/vehicleService";
import {
  formatPrice,
  getImageUrl,
  getVehicleModelName,
} from "../utils";

const MIN_SEARCH_LENGTH = 2;
const SEARCH_RESULTS_LIMIT = 10;

type SearchVehicleResultItemProps = {
  vehicle: VehicleListItem;
  onNavigate: () => void;
};

const SearchVehicleResultItem = ({
  vehicle,
  onNavigate,
}: SearchVehicleResultItemProps) => {
  const imageUrl = getImageUrl(vehicle.images[0].url);
  const modelName = getVehicleModelName(vehicle);

  return (
    <Link
      href={`/vehiculo/${vehicle.id}`}
      onClick={onNavigate}
      className="flex gap-3 rounded-md p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={imageUrl}
          alt={vehicle.title}
          className="size-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <p className="truncate text-sm font-semibold text-foreground">
          {modelName}
        </p>
        <p className="truncate text-xs text-muted-foreground">{vehicle.title}</p>
        <p className="text-sm font-bold text-foreground">
          {formatPrice(vehicle.price)}
        </p>
      </div>
    </Link>
  );
};

const SearchResultsSkeleton = () => (
  <div className="flex flex-col gap-2 p-2">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex gap-3 p-2">
        <Skeleton className="size-16 shrink-0 rounded-md" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export const SearchVehiclesInput = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search.trim(), 500);
  const hasMinLength = debouncedSearch.length >= MIN_SEARCH_LENGTH;

  const { data: vehicles = [], isLoading, isFetching } = useQuery({
    queryKey: ["vehicles-search", debouncedSearch],
    queryFn: async () => {
      const response = await vehicleService.vehicles.findAll({
        query: debouncedSearch,
        limit: SEARCH_RESULTS_LIMIT,
        page: 1,
      });

      if (!response.ok) {
        return [];
      }

      return response.data?.data ?? [];
    },
    enabled: hasMinLength,
  });

  useEffect(() => {
    if (search.trim().length >= MIN_SEARCH_LENGTH) {
      setIsOpen(true);
    }
  }, [search]);

  const handleNavigate = () => {
    setIsOpen(false);
    setSearch("");
  };

  const showHint = search.trim().length > 0 && search.trim().length < MIN_SEARCH_LENGTH;
  const showEmpty =
    hasMinLength && !isLoading && !isFetching && vehicles.length === 0;
  const showResults = hasMinLength && vehicles.length > 0;

  return (
    <div className="w-full min-w-0 flex-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-start gap-2 font-normal text-muted-foreground"
            >
              <Search className="size-4 shrink-0" aria-hidden />
              <span className="truncate">Buscar vehículos</span>
            </Button>
          }
        />
        <PopoverContent
          align="start"
          className="flex max-h-[min(24rem,70vh)] w-(--anchor-width) flex-col gap-0 overflow-hidden p-0"
        >
          <div className="p-2">
            <SearchInput
              placeholder="Marca, modelo o título…"
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
            />
          </div>

          <Separator />

          <div className="min-h-0 flex-1 overflow-y-auto">
            {showHint && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                Escribe al menos {MIN_SEARCH_LENGTH} caracteres
              </p>
            )}

            {!search.trim() && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                Busca por marca, modelo o título
              </p>
            )}

            {hasMinLength && (isLoading || isFetching) && <SearchResultsSkeleton />}

            {showEmpty && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No se encontraron vehículos para &quot;{debouncedSearch}&quot;
              </p>
            )}

            {showResults && (
              <ul className="flex flex-col p-1" aria-label="Resultados de búsqueda">
                {vehicles.map((vehicle) => (
                  <li key={vehicle.id}>
                    <SearchVehicleResultItem
                      vehicle={vehicle}
                      onNavigate={handleNavigate}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
