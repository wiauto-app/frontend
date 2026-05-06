"use client";

import { useCallback, useEffect, useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  MapPin,
  Gauge,
  Calendar,
  Settings,
  X,
  SlidersHorizontal,
  Car,
  Heart,
} from "lucide-react";
import { vehicleService } from "@/services/vehicleService";
import { VehicleListItem, FindAllVehiclesParams, PaginatedResponse } from "@/interfaces/vehicle.interface";

const CONDITION_OPTIONS = [
  { value: "new", label: "Nuevo" },
  { value: "used", label: "Usado" },
];

const TRANSMISSION_OPTIONS = [
  { value: "automatic", label: "Automático" },
  { value: "manual", label: "Manual" },
];

const PUBLISHER_OPTIONS = [
  { value: "professional", label: "Profesional" },
  { value: "particular", label: "Particular" },
];

const SORT_OPTIONS = [
  { value: "created_at", label: "Más recientes" },
  { value: "price", label: "Precio" },
  { value: "mileage", label: "Kilometraje" },
  { value: "power", label: "Potencia" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(km: number): string {
  return new Intl.NumberFormat("es-ES").format(km) + " km";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 30) return `Hace ${days} días`;
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace ${Math.floor(days / 365)} año(s)`;
}

function getConditionLabel(condition: string): string {
  return condition === "new" ? "Nuevo" : "Usado";
}

function getTransmissionLabel(t: string | undefined): string | null {
  if (!t) return null;
  return t === "automatic" ? "Automático" : "Manual";
}

function getImageUrl(images: VehicleListItem["images"]): string {
  if (!images || images.length === 0) return "/placeholder-car.jpg";
  return images[0]?.url || "/placeholder-car.jpg";
}

function VehicleCard({ vehicle }: { vehicle: VehicleListItem }) {
  const [saved, setSaved] = useState(false);
  const img = getImageUrl(vehicle.images);
  const transmission = getTransmissionLabel(vehicle.transmission_type);

  return (
    <Link href={`/vehiculo/${vehicle.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:border-gray-200">
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={img}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className="bg-blue-600/90 backdrop-blur text-white text-xs font-semibold px-2 py-0.5 rounded-md">
              {getConditionLabel(vehicle.condition)}
            </span>
            {vehicle.is_featured && (
              <span className="bg-amber-500/90 backdrop-blur text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                Destacado
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved(!saved);
            }}
            className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur rounded-full p-1.5 shadow-sm hover:bg-white transition-colors"
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="text-xl font-bold text-blue-600">{formatPrice(vehicle.price)}</div>
          <h3 className="mt-1.5 font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {vehicle.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {formatMileage(vehicle.mileage)}
            </span>
            {transmission && (
              <span className="flex items-center gap-1">
                <Settings className="h-3.5 w-3.5" />
                {transmission}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(vehicle.created_at)}
            </span>
          </div>
          {vehicle.vehicle_type && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{vehicle.vehicle_type.name}</span>
              {vehicle.lat && vehicle.lng && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  Ubicación
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function FilterSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function CheckboxFilter({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

const PAGE_SIZES = [12, 24, 48];

function VehicleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<FindAllVehiclesParams>(() => ({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    order_by: searchParams.get("order_by") || "created_at",
    order_direction: (searchParams.get("order_direction") as "asc" | "desc") || "desc",
    query: searchParams.get("query") || undefined,
    type_slug: searchParams.get("type_slug") || undefined,
    make_slug: searchParams.get("make_slug") || undefined,
    condition: searchParams.get("condition") || undefined,
    since_price: searchParams.get("since_price") ? Number(searchParams.get("since_price")) : undefined,
    until_price: searchParams.get("until_price") ? Number(searchParams.get("until_price")) : undefined,
    transmission_types: searchParams.get("transmission_types") ? (searchParams.get("transmission_types") || "").split(",") as any : undefined,
    publisher_types: searchParams.get("publisher_types") ? (searchParams.get("publisher_types") || "").split(",") as any : undefined,
    since_year: searchParams.get("since_year") ? Number(searchParams.get("since_year")) : undefined,
    until_year: searchParams.get("until_year") ? Number(searchParams.get("until_year")) : undefined,
    since_mileage: searchParams.get("since_mileage") ? Number(searchParams.get("since_mileage")) : undefined,
    until_mileage: searchParams.get("until_mileage") ? Number(searchParams.get("until_mileage")) : undefined,
    power_since: searchParams.get("power_since") ? Number(searchParams.get("power_since")) : undefined,
    power_until: searchParams.get("power_until") ? Number(searchParams.get("power_until")) : undefined,
    battery_capacity_since: searchParams.get("battery_capacity_since") ? Number(searchParams.get("battery_capacity_since")) : undefined,
    fuel_type_slugs: searchParams.get("fuel_type_slugs") ? (searchParams.get("fuel_type_slugs") || "").split(",") : undefined,
  }));

  const [searchInput, setSearchInput] = useState(filters.query || "");
  const [priceMin, setPriceMin] = useState(filters.since_price?.toString() || "");
  const [priceMax, setPriceMax] = useState(filters.until_price?.toString() || "");
  const [yearMin, setYearMin] = useState(filters.since_year?.toString() || "");
  const [yearMax, setYearMax] = useState(filters.until_year?.toString() || "");
  const [kmMin, setKmMin] = useState(filters.since_mileage?.toString() || "");
  const [kmMax, setKmMax] = useState(filters.until_mileage?.toString() || "");
  const [powerMin, setPowerMin] = useState(filters.power_since?.toString() || "");
  const [powerMax, setPowerMax] = useState(filters.power_until?.toString() || "");

  const buildQueryString = useCallback((params: FindAllVehiclesParams): string => {
    const qs = new URLSearchParams();
    (Object.entries(params) as [string, any][]).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        if (value.length > 0) qs.set(key, value.join(","));
      } else {
        qs.set(key, String(value));
      }
    });
    return qs.toString();
  }, []);

  const fetchVehicles = useCallback((params: FindAllVehiclesParams) => {
    setLoading(true);
    vehicleService.vehicles
      .findAll(params)
      .then((res: PaginatedResponse<VehicleListItem>) => {
        setVehicles(res.data || []);
        setTotal(res.total || 0);
      })
      .catch(() => {
        setVehicles([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = useCallback(() => {
    startTransition(() => {
      const newFilters: FindAllVehiclesParams = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        order_by: filters.order_by || "created_at",
        order_direction: filters.order_direction || "desc",
      };

      if (filters.query?.trim()) newFilters.query = filters.query.trim();
      if (filters.condition) newFilters.condition = filters.condition;
      if (filters.type_slug) newFilters.type_slug = filters.type_slug;
      if (filters.make_slug) newFilters.make_slug = filters.make_slug;
      if (filters.make_slug) newFilters.make_slug = filters.make_slug;
      if (filters.since_price) newFilters.since_price = filters.since_price;
      if (filters.until_price) newFilters.until_price = filters.until_price;
      if (filters.transmission_types?.length) newFilters.transmission_types = filters.transmission_types;
      if (filters.publisher_types?.length) newFilters.publisher_types = filters.publisher_types;
      if (filters.since_year) newFilters.since_year = filters.since_year;
      if (filters.until_year) newFilters.until_year = filters.until_year;
      if (filters.since_mileage) newFilters.since_mileage = filters.since_mileage;
      if (filters.until_mileage) newFilters.until_mileage = filters.until_mileage;
      if (filters.power_since) newFilters.power_since = filters.power_since;
      if (filters.power_until) newFilters.power_until = filters.power_until;
      if (filters.battery_capacity_since) newFilters.battery_capacity_since = filters.battery_capacity_since;
      if (filters.fuel_type_slugs?.length) newFilters.fuel_type_slugs = filters.fuel_type_slugs;

      const qs = buildQueryString(newFilters);
      router.push(`/vehiculos${qs ? "?" + qs : ""}`);
      fetchVehicles(newFilters);
    });
  }, [filters, buildQueryString, fetchVehicles, router]);

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      order_by: "created_at",
      order_direction: "desc",
    });
    setSearchInput("");
    setPriceMin("");
    setPriceMax("");
    setYearMin("");
    setYearMax("");
    setKmMin("");
    setKmMax("");
    setPowerMin("");
    setPowerMax("");
    router.push("/vehiculos");
    fetchVehicles({ page: 1, limit: 20, order_by: "created_at", order_direction: "desc" });
  };

  const updateFilter = (key: keyof FindAllVehiclesParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const toggleArrayFilter = (key: "transmission_types" | "publisher_types" | "fuel_type_slugs", value: string) => {
    setFilters((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next.length > 0 ? next : undefined, page: 1 };
    });
  };

  const goToPage = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    const qs = buildQueryString(newFilters);
    router.push(`/vehiculos${qs ? "?" + qs : ""}`);
    fetchVehicles(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("query", searchInput);
    setTimeout(applyFilters, 0);
  };

  useEffect(() => {
    const params: FindAllVehiclesParams = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      order_by: filters.order_by || "created_at",
      order_direction: filters.order_direction || "desc",
    };
    if (filters.query) params.query = filters.query;
    if (filters.type_slug) params.type_slug = filters.type_slug;
    if (filters.make_slug) params.make_slug = filters.make_slug;
    if (filters.since_price) params.since_price = filters.since_price;
    if (filters.until_price) params.until_price = filters.until_price;
    if (filters.transmission_types?.length) params.transmission_types = filters.transmission_types;
    if (filters.publisher_types?.length) params.publisher_types = filters.publisher_types;
    if (filters.since_year) params.since_year = filters.since_year;
    if (filters.until_year) params.until_year = filters.until_year;
    if (filters.since_mileage) params.since_mileage = filters.since_mileage;
    if (filters.until_mileage) params.until_mileage = filters.until_mileage;
    if (filters.power_since) params.power_since = filters.power_since;
    if (filters.power_until) params.power_until = filters.power_until;
    if (filters.battery_capacity_since) params.battery_capacity_since = filters.battery_capacity_since;
    if (filters.fuel_type_slugs?.length) params.fuel_type_slugs = filters.fuel_type_slugs;

    fetchVehicles(params);
  }, []);

  const totalPages = Math.ceil(total / (filters.limit || 20));
  const currentPage = filters.page || 1;
  const activeFilterCount = [
    filters.query, filters.condition, filters.type_slug, filters.make_slug, filters.since_price,
    filters.until_price, filters.transmission_types?.length, filters.publisher_types?.length,
    filters.since_year, filters.until_year, filters.since_mileage, filters.until_mileage,
    filters.power_since, filters.power_until, filters.battery_capacity_since, filters.fuel_type_slugs?.length,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 py-4">
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Vehículos</h1>
            <form onSubmit={handleSearch} className="flex-1 flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por marca, modelo..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
            </form>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-2 h-10 px-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filtros</h2>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Limpiar todo
                  </button>
                )}
              </div>
              <div className="px-4">
                <FilterSection title="Condición" defaultOpen>
                  {CONDITION_OPTIONS.map((opt) => (
                    <CheckboxFilter
                      key={opt.value}
                      label={opt.label}
                      checked={filters.condition === opt.value}
                      onChange={(checked) => updateFilter("condition", checked ? opt.value : undefined)}
                    />
                  ))}
                </FilterSection>
                <FilterSection title="Transmisión">
                  {TRANSMISSION_OPTIONS.map((opt) => (
                    <CheckboxFilter
                      key={opt.value}
                      label={opt.label}
                      checked={(filters.transmission_types || []).includes(opt.value as any)}
                      onChange={() => toggleArrayFilter("transmission_types", opt.value)}
                    />
                  ))}
                </FilterSection>
                <FilterSection title="Vendedor">
                  {PUBLISHER_OPTIONS.map((opt) => (
                    <CheckboxFilter
                      key={opt.value}
                      label={opt.label}
                      checked={(filters.publisher_types || []).includes(opt.value as any)}
                      onChange={() => toggleArrayFilter("publisher_types", opt.value)}
                    />
                  ))}
                </FilterSection>
                <FilterSection title="Precio (€)" defaultOpen>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      onBlur={() => updateFilter("since_price", priceMin ? Number(priceMin) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      onBlur={() => updateFilter("until_price", priceMax ? Number(priceMax) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </FilterSection>
                <FilterSection title="Año">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Desde"
                      value={yearMin}
                      onChange={(e) => setYearMin(e.target.value)}
                      onBlur={() => updateFilter("since_year", yearMin ? Number(yearMin) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Hasta"
                      value={yearMax}
                      onChange={(e) => setYearMax(e.target.value)}
                      onBlur={() => updateFilter("until_year", yearMax ? Number(yearMax) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </FilterSection>
                <FilterSection title="Kilometraje">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Desde"
                      value={kmMin}
                      onChange={(e) => setKmMin(e.target.value)}
                      onBlur={() => updateFilter("since_mileage", kmMin ? Number(kmMin) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Hasta"
                      value={kmMax}
                      onChange={(e) => setKmMax(e.target.value)}
                      onBlur={() => updateFilter("until_mileage", kmMax ? Number(kmMax) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </FilterSection>
                <FilterSection title="Potencia (kW)">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Desde"
                      value={powerMin}
                      onChange={(e) => setPowerMin(e.target.value)}
                      onBlur={() => updateFilter("power_since", powerMin ? Number(powerMin) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Hasta"
                      value={powerMax}
                      onChange={(e) => setPowerMax(e.target.value)}
                      onBlur={() => updateFilter("power_until", powerMax ? Number(powerMax) : undefined)}
                      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </FilterSection>
                <FilterSection title="Combustible">
                  {[
                    { label: "Gasolina", slug: "gasolina" },
                    { label: "Diésel", slug: "diesel" },
                    { label: "Híbrido", slug: "hibrido" },
                    { label: "Eléctrico", slug: "electrico" },
                  ].map(({ label, slug }) => (
                    <CheckboxFilter
                      key={slug}
                      label={label}
                      checked={(filters.fuel_type_slugs || []).includes(slug)}
                      onChange={() => toggleArrayFilter("fuel_type_slugs", slug)}
                    />
                  ))}
                </FilterSection>
              </div>
              <div className="p-4">
                <button
                  onClick={applyFilters}
                  className="w-full h-10 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </aside>

          {filterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold text-gray-900">Filtros</h2>
                  <button onClick={() => setFilterOpen(false)} className="p-1 hover:bg-gray-100 rounded-md">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-4">
                  <FilterSection title="Condición" defaultOpen>
                    {CONDITION_OPTIONS.map((opt) => (
                      <CheckboxFilter
                        key={opt.value}
                        label={opt.label}
                        checked={filters.condition === opt.value}
                        onChange={(checked) => updateFilter("condition", checked ? opt.value : undefined)}
                      />
                    ))}
                  </FilterSection>
                  <FilterSection title="Transmisión">
                    {TRANSMISSION_OPTIONS.map((opt) => (
                      <CheckboxFilter
                        key={opt.value}
                        label={opt.label}
                        checked={(filters.transmission_types || []).includes(opt.value as any)}
                        onChange={() => toggleArrayFilter("transmission_types", opt.value)}
                      />
                    ))}
                  </FilterSection>
                  <FilterSection title="Precio (€)">
                    <div className="flex gap-2">
                      <input type="number" placeholder="Mín" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} onBlur={() => updateFilter("since_price", priceMin ? Number(priceMin) : undefined)} className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500" />
                      <input type="number" placeholder="Máx" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} onBlur={() => updateFilter("until_price", priceMax ? Number(priceMax) : undefined)} className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </FilterSection>
                  <FilterSection title="Año">
                    <div className="flex gap-2">
                      <input type="number" placeholder="Desde" value={yearMin} onChange={(e) => setYearMin(e.target.value)} onBlur={() => updateFilter("since_year", yearMin ? Number(yearMin) : undefined)} className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500" />
                      <input type="number" placeholder="Hasta" value={yearMax} onChange={(e) => setYearMax(e.target.value)} onBlur={() => updateFilter("until_year", yearMax ? Number(yearMax) : undefined)} className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </FilterSection>
                  <FilterSection title="Kilometraje">
                    <div className="flex gap-2">
                      <input type="number" placeholder="Desde" value={kmMin} onChange={(e) => setKmMin(e.target.value)} onBlur={() => updateFilter("since_mileage", kmMin ? Number(kmMin) : undefined)} className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500" />
                      <input type="number" placeholder="Hasta" value={kmMax} onChange={(e) => setKmMax(e.target.value)} onBlur={() => updateFilter("until_mileage", kmMax ? Number(kmMax) : undefined)} className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </FilterSection>
                </div>
                <div className="p-4 flex gap-2">
                  <button onClick={resetFilters} className="flex-1 h-10 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Limpiar
                  </button>
                  <button onClick={() => { setFilterOpen(false); applyFilters(); }} className="flex-1 h-10 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {loading ? "Buscando..." : `${total} vehículo${total !== 1 ? "s" : ""}`}
                </span>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                    <X className="h-3 w-3" />
                    Limpiar filtros ({activeFilterCount})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={`${filters.order_by}-${filters.order_direction}`}
                  onChange={(e) => {
                    const [order_by, order_direction] = e.target.value.split("-") as [string, "asc" | "desc"];
                    updateFilter("order_by", order_by);
                    updateFilter("order_direction", order_direction);
                    setTimeout(() => {
                      const newFilters = { ...filters, order_by, order_direction, page: 1 };
                      const qs = buildQueryString(newFilters);
                      router.push(`/vehiculos${qs ? "?" + qs : ""}`);
                      fetchVehicles(newFilters);
                    }, 0);
                  }}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <optgroup key={opt.value} label={opt.label}>
                      <option value={`${opt.value}-desc`}>Mayor a menor</option>
                      <option value={`${opt.value}-asc`}>Menor a mayor</option>
                    </optgroup>
                  ))}
                </select>
                <select
                  value={filters.limit || 20}
                  onChange={(e) => {
                    const limit = Number(e.target.value);
                    updateFilter("limit", limit);
                    setTimeout(() => {
                      const newFilters = { ...filters, limit, page: 1 };
                      const qs = buildQueryString(newFilters);
                      router.push(`/vehiculos${qs ? "?" + qs : ""}`);
                      fetchVehicles(newFilters);
                    }, 0);
                  }}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>{size} por página</option>
                  ))}
                </select>
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`h-9 w-9 flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`h-9 w-9 flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.query && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                    Búsqueda: {filters.query}
                    <button onClick={() => { updateFilter("query", undefined); setSearchInput(""); }} className="hover:text-blue-900"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.condition && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                    {getConditionLabel(filters.condition)}
                    <button onClick={() => updateFilter("condition", undefined)} className="hover:text-blue-900"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {(filters.since_price || filters.until_price) && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                    Precio: {filters.since_price ? formatPrice(filters.since_price) : "0"} - {filters.until_price ? formatPrice(filters.until_price) : "∞"}
                    <button onClick={() => { updateFilter("since_price", undefined); updateFilter("until_price", undefined); setPriceMin(""); setPriceMax(""); }} className="hover:text-blue-900"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.transmission_types?.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                    {getTransmissionLabel(t)}
                    <button onClick={() => toggleArrayFilter("transmission_types", t)} className="hover:text-blue-900"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: filters.limit || 20 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (!vehicles || vehicles.length === 0) ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <Car className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No se encontraron vehículos</h3>
                <p className="mt-2 text-gray-500">Intenta ajustar los filtros o realizar una nueva búsqueda</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "flex flex-col gap-4"
                }>
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Anterior
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;
                        const showEllipsis =
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2);

                        if (!showPage && !showEllipsis) return null;
                        if (!showPage && showEllipsis) {
                          return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              page === currentPage
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-gray-500">Cargando vehículos...</p>
        </div>
      </div>
    }>
      <VehicleContent />
    </Suspense>
  );
}
