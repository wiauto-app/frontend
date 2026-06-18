"use client";

import { useState } from "react";
import {
  MapPin,
  Star,
  Building2,
  ShoppingCart,
  Car,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BRAND_BLUE,
  BRAND_BLUE_LIGHT,
  DEALER_TYPE_OPTIONS,
  DEALER_SERVICE_OPTIONS,
  MIN_VEHICLES_OPTIONS,
} from "../constants";
import { useDealersListingFilters } from "../hooks/useDealersListingFilters";
import Link from "next/link";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
      <Icon className="size-4" style={{ color: BRAND_BLUE }} />
      {children}
    </p>
  );
}

export function ConcesionariasFiltersPanel() {
  const { filters, commitFilters, resetFilters } = useDealersListingFilters();

  const [locationInput, setLocationInput] = useState(filters.location ?? "");
  const [radius, setRadius] = useState(filters.radius ?? 50);
  const [selectedTypes, setSelectedTypes] = useState(filters.types ?? []);
  const [selectedServices, setSelectedServices] = useState(
    filters.services ?? [],
  );
  const [minRating, setMinRating] = useState(filters.minRating);
  const [minVehicles, setMinVehicles] = useState(filters.minVehicles ?? 0);

  const toggleType = (slug: string) => {
    setSelectedTypes((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug],
    );
  };

  const toggleService = (slug: string) => {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleApplyFilters = () => {
    commitFilters({
      ...filters,
      location: locationInput.trim() || undefined,
      radius: radius || undefined,
      types: selectedTypes.length ? selectedTypes : undefined,
      services: selectedServices.length ? selectedServices : undefined,
      minRating,
      minVehicles: minVehicles > 0 ? minVehicles : undefined,
      page: 1,
    });
  };

  return (
    <aside className="sticky top-16 h-fit">
      <Card className="rounded-none" size="sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold transition-colors hover:opacity-80"
            style={{ color: BRAND_BLUE }}
            id="clear-dealers-filters"
          >
            Limpiar todo
          </button>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <section>
            <SectionTitle icon={MapPin}>Ubicación</SectionTitle>
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <MapPin className="size-3.5 shrink-0 text-slate-400" />
              <input
                id="dealer-location-input"
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Buscar ubicación..."
                className="flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                <span>Radio</span>
                <span className="font-semibold" style={{ color: BRAND_BLUE }}>
                  {radius === 0 ? "Todo el país" : `${radius} km`}
                </span>
              </div>
              <input
                id="dealer-radius-slider"
                type="range"
                min={0}
                max={100}
                step={10}
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
                style={{ accentColor: BRAND_BLUE }}
                aria-label="Radio de búsqueda"
              />
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle icon={Building2}>Tipo de concesionario</SectionTitle>
            <div className="mt-3 flex flex-col gap-2.5">
              {DEALER_TYPE_OPTIONS.map(({ slug, label }) => (
                <div key={slug} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`dealer-type-${slug}`}
                    checked={selectedTypes.includes(slug)}
                    onCheckedChange={() => toggleType(slug)}
                  />
                  <Label
                    htmlFor={`dealer-type-${slug}`}
                    className="cursor-pointer text-sm font-normal text-slate-700"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle icon={ShoppingCart}>Servicios</SectionTitle>
            <div className="mt-3 flex flex-col gap-2.5">
              {DEALER_SERVICE_OPTIONS.map(({ slug, label }) => (
                <div key={slug} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`dealer-service-${slug}`}
                    checked={selectedServices.includes(slug)}
                    onCheckedChange={() => toggleService(slug)}
                  />
                  <Label
                    htmlFor={`dealer-service-${slug}`}
                    className="cursor-pointer text-sm font-normal text-slate-700"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle icon={Star}>Calificación mínima</SectionTitle>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = (minRating ?? 0) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() =>
                      setMinRating(minRating === n ? undefined : n)
                    }
                    aria-label={`${n} estrella${n > 1 ? "s" : ""} o más`}
                    id={`dealer-rating-star-${n}`}
                  >
                    <svg
                      className="size-6 transition-transform hover:scale-110"
                      viewBox="0 0 20 20"
                      fill={active ? "#FFB800" : "#E2E8F0"}
                    >
                      <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 1z" />
                    </svg>
                  </button>
                );
              })}
              <span className="ml-1 text-xs text-slate-500">
                {minRating ? `${minRating}.0 o más` : "Cualquiera"}
              </span>
            </div>
          </section>

          <Separator />

          <section>
            <SectionTitle icon={Car}>Vehículos disponibles</SectionTitle>
            <div className="mt-3">
              <Select
                value={String(minVehicles)}
                onValueChange={(val) => setMinVehicles(parseInt(val, 10))}
              >
                <SelectTrigger
                  className="h-9 w-full rounded-lg border-slate-200 text-sm"
                  id="dealer-min-vehicles"
                >
                  <SelectValue placeholder="Mínimo de vehículos" />
                </SelectTrigger>
                <SelectContent>
                  {MIN_VEHICLES_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={String(value)}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <Button
            type="button"
            onClick={handleApplyFilters}
            className="w-full rounded-lg font-semibold text-white"
            style={{ backgroundColor: BRAND_BLUE }}
            id="apply-dealers-filters"
          >
            Aplicar filtros
          </Button>

          <section
            className="rounded-xl p-4"
            style={{ backgroundColor: BRAND_BLUE_LIGHT }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <Shield className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  ¿Eres concesionario?
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Únete a WiAuto y llega a miles de compradores potenciales.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-8 rounded-lg border-white bg-white text-xs font-semibold hover:bg-white/90"
                  style={{ color: BRAND_BLUE }}
                  id="dealers-cta-btn"
                >
                  <Button
                   variant="outline"
                   size="sm"
                   className="mt-3 h-8 rounded-lg border-white bg-white text-xs font-semibold hover:bg-white/90"
                   style={{ color: BRAND_BLUE }}
                   id="dealers-cta-btn"
                 >
                  <Link href="/registrar-concesionario">Más información</Link>
                 </Button>
                </Button>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </aside>
  );
}
