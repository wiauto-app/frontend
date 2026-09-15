"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Star, Car, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import { provincesCatalogService } from "@/services/locations/provincesCatalogService";
import type { ProvinceCatalogItem } from "@/services/locations/types/province.types";
import {
  BRAND_BLUE,
  BRAND_BLUE_LIGHT,
  MIN_VEHICLES_OPTIONS,
} from "../constants";
import {
  DEALER_FILTER_KEYS,
  DEALER_FILTER_KEYS_LIST,
} from "../constants/filterKeys.constants";

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
  const router = useRouter();
  const { values, applyUrlUpdates, handleClearAll } = useFiltersManager({
    keys: DEALER_FILTER_KEYS_LIST,
  });

  const [provinces, setProvinces] = useState<ProvinceCatalogItem[]>([]);
  const [provinceSlug, setProvinceSlug] = useState(
    String(values[DEALER_FILTER_KEYS.PROVINCE_SLUG] ?? ""),
  );
  const [radius, setRadius] = useState(
    Number(values[DEALER_FILTER_KEYS.RADIUS] ?? 50) || 0,
  );
  const [minRating, setMinRating] = useState<number | undefined>(() => {
    const raw = values[DEALER_FILTER_KEYS.RATING_SINCE];
    return raw ? Number(raw) : undefined;
  });
  const [minVehicles, setMinVehicles] = useState(
    Number(values[DEALER_FILTER_KEYS.VEHICLES_NUMBER] ?? 0) || 0,
  );

  useEffect(() => {
    provincesCatalogService
      .findAll({ page: 1, limit: 100, order_by: "name", order_direction: "ASC" })
      .then((result) => setProvinces(result.data))
      .catch(() => setProvinces([]));
  }, []);

  const handleApplyFilters = () => {
    applyUrlUpdates({
      [DEALER_FILTER_KEYS.PROVINCE_SLUG]: provinceSlug || undefined,
      [DEALER_FILTER_KEYS.RADIUS]:
        radius > 0 && provinceSlug ? String(radius) : undefined,
      [DEALER_FILTER_KEYS.RATING_SINCE]:
        minRating != null && minRating > 0 ? String(minRating) : undefined,
      [DEALER_FILTER_KEYS.VEHICLES_NUMBER]:
        minVehicles > 0 ? String(minVehicles) : undefined,
      [DEALER_FILTER_KEYS.PAGE]: undefined,
    });
    router.refresh();
  };

  const handleClearAllFilters = () => {
    setProvinceSlug("");
    setRadius(50);
    setMinRating(undefined);
    setMinVehicles(0);
    handleClearAll();
    router.refresh();
  };

  return (
    <aside className="sticky top-16 h-fit">
      <Card className="rounded-none" size="sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
          <button
            type="button"
            onClick={handleClearAllFilters}
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
            <div className="mt-2">
              <Select
                value={provinceSlug || undefined}
                onValueChange={(value) => setProvinceSlug(value ?? "")}
              >
                <SelectTrigger
                  className="h-10 w-full rounded-lg border-slate-200 text-sm"
                  id="dealer-province-select"
                >
                  <SelectValue placeholder="Selecciona una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.slug} value={province.slug}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                <span>Radio</span>
                <span className="font-semibold" style={{ color: BRAND_BLUE }}>
                  {!provinceSlug || radius === 0
                    ? "Toda la provincia"
                    : `${radius} km`}
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
                disabled={!provinceSlug}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:opacity-40"
                style={{ accentColor: BRAND_BLUE }}
                aria-label="Radio de búsqueda en kilómetros"
              />
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
                onValueChange={(val) =>
                  setMinVehicles(parseInt(val ?? "0", 10))
                }
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
                <Link
                  href="/registrar-concesionario"
                  className="mt-3 inline-flex h-8 items-center justify-center rounded-lg border border-white bg-white px-3 text-xs font-semibold hover:bg-white/90"
                  style={{ color: BRAND_BLUE }}
                  id="dealers-cta-btn"
                >
                  Más información
                </Link>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </aside>
  );
}
