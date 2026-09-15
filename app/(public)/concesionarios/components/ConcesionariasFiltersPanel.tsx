"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Star, Car, Shield } from "lucide-react";
import Link from "next/link";
import { HiOutlineStar, HiStar } from "react-icons/hi";

import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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

interface SectionTitleProps {
  icon: React.ElementType;
  children: React.ReactNode;
}

const SectionTitle = ({ icon: Icon, children }: SectionTitleProps) => (
  <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
    <Icon className="size-4" style={{ color: BRAND_BLUE }} />
    {children}
  </p>
);

const readStringFilter = (value: string | string[] | undefined): string =>
  typeof value === "string" ? value : "";

const readNumberFilter = (
  value: string | string[] | undefined,
): number | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function ConcesionariasFiltersPanel() {
  const { values, applyUrlUpdates, handleClearAll } = useFiltersManager({
    keys: DEALER_FILTER_KEYS_LIST,
  });

  const [provinces, setProvinces] = useState<ProvinceCatalogItem[]>([]);

  const provinceSlug = readStringFilter(values[DEALER_FILTER_KEYS.PROVINCE_SLUG]);
  const radius = readNumberFilter(values[DEALER_FILTER_KEYS.RADIUS]) ?? 0;
  const minRating = readNumberFilter(values[DEALER_FILTER_KEYS.RATING_SINCE]);
  const minVehicles =
    readNumberFilter(values[DEALER_FILTER_KEYS.VEHICLES_NUMBER]) ?? 0;

  const provinceItems = useMemo(
    () =>
      provinces.map((province) => ({
        label: province.name,
        value: province.slug,
      })),
    [provinces],
  );

  const vehicleItems = useMemo(
    () =>
      MIN_VEHICLES_OPTIONS.map(({ value, label }) => ({
        label,
        value: String(value),
      })),
    [],
  );

  useEffect(() => {
    provincesCatalogService
      .findAll({ page: 1, limit: 100, order_by: "name", order_direction: "ASC" })
      .then((result) => setProvinces(result.data))
      .catch(() => setProvinces([]));
  }, []);

  const handleProvinceChange = (next: string) => {
    applyUrlUpdates({
      [DEALER_FILTER_KEYS.PROVINCE_SLUG]: next || undefined,
      [DEALER_FILTER_KEYS.RADIUS]:
        next && radius > 0 ? String(radius) : undefined,
      [DEALER_FILTER_KEYS.PAGE]: undefined,
    });
  };

  const handleRadiusChange = (next: number) => {
    if (!provinceSlug) {
      return;
    }

    applyUrlUpdates({
      [DEALER_FILTER_KEYS.RADIUS]: next > 0 ? String(next) : undefined,
      [DEALER_FILTER_KEYS.PAGE]: undefined,
    });
  };

  const handleRatingChange = (next: number) => {
    applyUrlUpdates({
      [DEALER_FILTER_KEYS.RATING_SINCE]:
        minRating === next ? undefined : String(next),
      [DEALER_FILTER_KEYS.PAGE]: undefined,
    });
  };

  const handleMinVehiclesChange = (next: number) => {
    applyUrlUpdates({
      [DEALER_FILTER_KEYS.VEHICLES_NUMBER]:
        next > 0 ? String(next) : undefined,
      [DEALER_FILTER_KEYS.PAGE]: undefined,
    });
  };

  return (
    <aside className="sticky top-16 h-fit">
      <Card className="rounded-none" size="sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
          <button
            type="button"
            onClick={handleClearAll}
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
                onValueChange={(value) => handleProvinceChange(value ?? "")}
                items={provinceItems}
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
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Radio</span>
                <span className="font-semibold" style={{ color: BRAND_BLUE }}>
                  {!provinceSlug || radius === 0
                    ? "Toda la provincia"
                    : `${radius} km`}
                </span>
              </div>
              <Slider
                aria-label="Radio de búsqueda en kilómetros"
                value={[radius]}
                min={0}
                max={100}
                step={10}
                disabled={!provinceSlug}
                onValueChange={(next) => {
                  const value = Array.isArray(next) ? next[0] : next;
                  if (!Number.isFinite(value)) {
                    return;
                  }
                  handleRadiusChange(value);
                }}
              />
              <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-muted-foreground">
                <span>0 km</span>
                <span>100 km</span>
              </div>
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
                    onClick={() => handleRatingChange(n)}
                    aria-label={`${n} estrella${n > 1 ? "s" : ""} o más`}
                    id={`dealer-rating-star-${n}`}
                    className="flex size-7 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  >
                    {active ? (
                      <HiStar className="size-6 text-[#FFB800] transition-transform hover:scale-110" />
                    ) : (
                      <HiOutlineStar className="size-6 text-slate-300 transition-transform hover:scale-110" />
                    )}
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
                  handleMinVehiclesChange(parseInt(val ?? "0", 10))
                }
                items={vehicleItems}
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
