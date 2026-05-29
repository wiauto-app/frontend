"use client";

import { Suspense, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Car, X } from "lucide-react";
import { vehicleService } from "@/services/vehicleService";
import type { FindAllVehiclesParams, VehicleListItem } from "@/interfaces/vehicle.interface";
import { Footer, NewsletterSection } from "@/components/home";
import { VehiclesToolbar } from "./components/VehiclesToolbar";
import { VehiclesSidebar } from "./components/VehiclesSidebar";
import { VehicleGridCard } from "./components/VehicleGridCard";
import { VehicleListCard } from "./components/VehicleListCard";
import { VehiclesPagination } from "./components/VehiclesPagination";
import { NEWSLETTER_FALLBACK, SORT_OPTIONS } from "./constants";
import { getConditionLabel } from "./utils";

function parseSearchParams(searchParams: URLSearchParams): FindAllVehiclesParams {
  return {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 12,
    order_by: searchParams.get("order_by") || "created_at",
    order_direction: (searchParams.get("order_direction") as "asc" | "desc") || "desc",
    query: searchParams.get("query") || undefined,
    type_slug: searchParams.get("type_slug") || undefined,
    make_slug: searchParams.get("make_slug") || undefined,
    condition: searchParams.get("condition") || undefined,
    since_price: searchParams.get("since_price") ? Number(searchParams.get("since_price")) : undefined,
    until_price: searchParams.get("until_price") ? Number(searchParams.get("until_price")) : undefined,
    transmission_types: searchParams.get("transmission_types")
      ? ((searchParams.get("transmission_types") || "").split(",") as FindAllVehiclesParams["transmission_types"])
      : undefined,
    publisher_types: searchParams.get("publisher_types")
      ? ((searchParams.get("publisher_types") || "").split(",") as FindAllVehiclesParams["publisher_types"])
      : undefined,
    since_year: searchParams.get("since_year") ? Number(searchParams.get("since_year")) : undefined,
    until_year: searchParams.get("until_year") ? Number(searchParams.get("until_year")) : undefined,
    since_mileage: searchParams.get("since_mileage") ? Number(searchParams.get("since_mileage")) : undefined,
    until_mileage: searchParams.get("until_mileage") ? Number(searchParams.get("until_mileage")) : undefined,
    power_since: searchParams.get("power_since") ? Number(searchParams.get("power_since")) : undefined,
    power_until: searchParams.get("power_until") ? Number(searchParams.get("power_until")) : undefined,
    fuel_type_slugs: searchParams.get("fuel_type_slugs")
      ? (searchParams.get("fuel_type_slugs") || "").split(",")
      : undefined,
    traction_slugs: searchParams.get("traction_slugs")
      ? (searchParams.get("traction_slugs") || "").split(",")
      : undefined,
  };
}

function buildQueryString(params: FindAllVehiclesParams): string {
  const qs = new URLSearchParams();
  (Object.entries(params) as [string, unknown][]).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length > 0) qs.set(key, value.join(","));
      return;
    }
    qs.set(key, String(value));
  });
  return qs.toString();
}

function VehicleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [, startTransition] = useTransition();

  const [filters, setFilters] = useState<FindAllVehiclesParams>(() =>
    parseSearchParams(searchParams),
  );
  const [searchInput, setSearchInput] = useState(filters.query || "");
  const [priceMin, setPriceMin] = useState(filters.since_price?.toString() || "");
  const [priceMax, setPriceMax] = useState(filters.until_price?.toString() || "");
  const [selectedBrand, setSelectedBrand] = useState(filters.make_slug || "");
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedDoors, setSelectedDoors] = useState<number[]>([]);
  const [selectedTrunks, setSelectedTrunks] = useState<string[]>([]);

  const sortValue = `${filters.order_by}-${filters.order_direction}`;

  const fetchVehicles = useCallback((params: FindAllVehiclesParams) => {
    setLoading(true);
    vehicleService.vehicles
      .findAll(params)
      .then((response) => {
        if (!response.ok) {
          setVehicles([]);
          setTotal(0);
          return;
        }
        setVehicles(response.data?.data || []);
        setTotal(response.data?.total || 0);
      })
      .catch(() => {
        setVehicles([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const pushFilters = useCallback(
    (nextFilters: FindAllVehiclesParams) => {
      const qs = buildQueryString(nextFilters);
      router.push(`/vehiculos${qs ? `?${qs}` : ""}`);
      fetchVehicles(nextFilters);
    },
    [fetchVehicles, router],
  );

  const commitFilters = useCallback(
    (nextFilters: FindAllVehiclesParams) => {
      startTransition(() => {
        setFilters(nextFilters);
        pushFilters(nextFilters);
      });
    },
    [pushFilters],
  );

  const resetFilters = () => {
    const nextFilters: FindAllVehiclesParams = {
      page: 1,
      limit: 12,
      order_by: "created_at",
      order_direction: "desc",
    };
    setFilters(nextFilters);
    setSearchInput("");
    setPriceMin("");
    setPriceMax("");
    setSelectedBrand("");
    setSelectedGenerations([]);
    setSelectedVersions([]);
    setSelectedEngines([]);
    setSelectedBodyTypes([]);
    setSelectedDoors([]);
    setSelectedTrunks([]);
    router.push("/vehiculos");
    fetchVehicles(nextFilters);
  };

  const toggleArrayFilter = (
    key: "fuel_type_slugs" | "traction_slugs",
    value: string,
  ) => {
    setFilters((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      const updated = { ...prev, [key]: next.length > 0 ? next : undefined, page: 1 };
      commitFilters(updated);
      return updated;
    });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const nextFilters = { ...filters, query: searchInput.trim() || undefined, page: 1 };
    setFilters(nextFilters);
    pushFilters(nextFilters);
  };

  const handleSortChange = (value: string) => {
    const [order_by, order_direction] = value.split("-") as [string, "asc" | "desc"];
    const nextFilters = { ...filters, order_by, order_direction, page: 1 };
    setFilters(nextFilters);
    pushFilters(nextFilters);
  };

  const goToPage = (page: number) => {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    pushFilters(nextFilters);
  };

  const handlePriceBlur = () => {
    const nextFilters = {
      ...filters,
      since_price: priceMin ? Number(priceMin) : undefined,
      until_price: priceMax ? Number(priceMax) : undefined,
      page: 1,
    };
    commitFilters(nextFilters);
  };

  const handleConditionChange = (condition: "new" | "used" | undefined) => {
    commitFilters({ ...filters, condition, page: 1 });
  };

  const handleBrandChange = (slug: string) => {
    setSelectedBrand(slug);
    commitFilters({ ...filters, make_slug: slug || undefined, page: 1 });
  };

  const handleGenerationToggle = (label: string, since: number, until: number) => {
    setSelectedGenerations((prev) => {
      const active = prev.includes(label);
      return active ? prev.filter((item) => item !== label) : [...prev, label];
    });
    const active = selectedGenerations.includes(label);
    commitFilters({
      ...filters,
      since_year: active ? undefined : since,
      until_year: active ? undefined : until,
      page: 1,
    });
  };

  const toggleLocalSelection = <T,>(
    value: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  useEffect(() => {
    fetchVehicles(parseSearchParams(searchParams));
  }, [fetchVehicles, searchParams]);

  useEffect(() => {
    if (mode === "sell") {
      router.push("/crear-vehiculo");
    }
  }, [mode, router]);

  const totalPages = Math.ceil(total / (filters.limit || 12));
  const currentPage = filters.page || 1;

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (filters.query) {
      chips.push({
        key: "query",
        label: `Búsqueda: ${filters.query}`,
        onRemove: () => {
          setSearchInput("");
          commitFilters({ ...filters, query: undefined, page: 1 });
        },
      });
    }
    if (filters.condition) {
      chips.push({
        key: "condition",
        label: getConditionLabel(filters.condition),
        onRemove: () => commitFilters({ ...filters, condition: undefined, page: 1 }),
      });
    }
    if (filters.make_slug) {
      chips.push({
        key: "make",
        label: filters.make_slug,
        onRemove: () => {
          setSelectedBrand("");
          commitFilters({ ...filters, make_slug: undefined, page: 1 });
        },
      });
    }
    filters.fuel_type_slugs?.forEach((slug) => {
      chips.push({
        key: `fuel-${slug}`,
        label: slug,
        onRemove: () => toggleArrayFilter("fuel_type_slugs", slug),
      });
    });
    filters.traction_slugs?.forEach((slug) => {
      chips.push({
        key: `traction-${slug}`,
        label: slug,
        onRemove: () => toggleArrayFilter("traction_slugs", slug),
      });
    });

    return chips;
  }, [commitFilters, filters]);

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <VehiclesToolbar
        mode={mode}
        onModeChange={setMode}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearch}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        sortValue={sortValue}
        onSortChange={handleSortChange}
        sortOptions={SORT_OPTIONS}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          {sidebarOpen && (
            <VehiclesSidebar
              filters={filters}
              priceMin={priceMin}
              priceMax={priceMax}
              selectedBrand={selectedBrand}
              selectedGenerations={selectedGenerations}
              selectedVersions={selectedVersions}
              selectedEngines={selectedEngines}
              selectedBodyTypes={selectedBodyTypes}
              selectedDoors={selectedDoors}
              selectedTrunks={selectedTrunks}
              onConditionChange={handleConditionChange}
              onBrandChange={handleBrandChange}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              onPriceBlur={handlePriceBlur}
              onGenerationToggle={handleGenerationToggle}
              onVersionToggle={(version) => toggleLocalSelection(version, setSelectedVersions)}
              onEngineToggle={(engine) => toggleLocalSelection(engine, setSelectedEngines)}
              onFuelToggle={(slug) => toggleArrayFilter("fuel_type_slugs", slug)}
              onBodyTypeToggle={(slug) => toggleLocalSelection(slug, setSelectedBodyTypes)}
              onDoorToggle={(door) => toggleLocalSelection(door, setSelectedDoors)}
              onTrunkToggle={(trunk) => toggleLocalSelection(trunk, setSelectedTrunks)}
              onTractionToggle={(slug) => toggleArrayFilter("traction_slugs", slug)}
              onReset={resetFilters}
              className="hidden lg:block"
            />
          )}

          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar filtros"
              />
              <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] overflow-y-auto bg-[#F4F7FB] p-4 shadow-xl">
                <VehiclesSidebar
                  filters={filters}
                  priceMin={priceMin}
                  priceMax={priceMax}
                  selectedBrand={selectedBrand}
                  selectedGenerations={selectedGenerations}
                  selectedVersions={selectedVersions}
                  selectedEngines={selectedEngines}
                  selectedBodyTypes={selectedBodyTypes}
                  selectedDoors={selectedDoors}
                  selectedTrunks={selectedTrunks}
                  onConditionChange={handleConditionChange}
                  onBrandChange={handleBrandChange}
                  onPriceMinChange={setPriceMin}
                  onPriceMaxChange={setPriceMax}
                  onPriceBlur={handlePriceBlur}
                  onGenerationToggle={handleGenerationToggle}
                  onVersionToggle={(version) => toggleLocalSelection(version, setSelectedVersions)}
                  onEngineToggle={(engine) => toggleLocalSelection(engine, setSelectedEngines)}
                  onFuelToggle={(slug) => toggleArrayFilter("fuel_type_slugs", slug)}
                  onBodyTypeToggle={(slug) => toggleLocalSelection(slug, setSelectedBodyTypes)}
                  onDoorToggle={(door) => toggleLocalSelection(door, setSelectedDoors)}
                  onTrunkToggle={(trunk) => toggleLocalSelection(trunk, setSelectedTrunks)}
                  onTractionToggle={(slug) => toggleArrayFilter("traction_slugs", slug)}
                  onReset={() => {
                    resetFilters();
                    setSidebarOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">
                {loading ? "Buscando..." : `${total} resultados`}
              </p>
              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeFilterChips.map((chip) => (
                    <span
                      key={chip.key}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF2FF] px-3 py-1 text-xs font-semibold text-[#0061F2]"
                    >
                      {chip.label}
                      <button type="button" onClick={chip.onRemove} aria-label={`Quitar ${chip.label}`}>
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "flex flex-col gap-4"
                }
              >
                {Array.from({ length: filters.limit || 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white"
                  >
                    <div className={viewMode === "grid" ? "aspect-[4/3] bg-slate-200" : "h-48 bg-slate-200"} />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-24 rounded bg-slate-200" />
                      <div className="h-6 w-full rounded bg-slate-200" />
                      <div className="h-4 w-2/3 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
                <Car className="mx-auto size-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No se encontraron vehículos
                </h3>
                <p className="mt-2 text-slate-500">
                  Intenta ajustar los filtros o realizar una nueva búsqueda
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center rounded-lg bg-[#0061F2] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {vehicles.map((vehicle) =>
                    viewMode === "grid" ? (
                      <VehicleGridCard key={vehicle.id} vehicle={vehicle} />
                    ) : (
                      <VehicleListCard key={vehicle.id} vehicle={vehicle} />
                    ),
                  )}
                </div>

                <VehiclesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <NewsletterSection data={NEWSLETTER_FALLBACK} />
      <Footer />
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
          <div className="text-center">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-[#0061F2] border-r-transparent" />
            <p className="mt-4 text-slate-500">Cargando vehículos...</p>
          </div>
        </div>
      }
    >
      <VehicleContent />
    </Suspense>
  );
}
