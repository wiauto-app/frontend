"use client";

import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import {
  BRAND_BLUE,
  BRAND_BLUE_LIGHT,
  BRAND_OPTIONS,
  BODY_TYPE_OPTIONS,
  DEFAULT_PRICE_RANGE,
  DOOR_OPTIONS,
  ENGINE_OPTIONS,
  FUEL_OPTIONS,
  GENERATION_OPTIONS,
  TRACTION_OPTIONS,
  TRUNK_OPTIONS,
  VERSION_OPTIONS,
} from "../constants";

type VehiclesSidebarProps = {
  filters: FindAllVehiclesParams;
  priceMin: string;
  priceMax: string;
  selectedBrand: string;
  selectedGenerations: string[];
  selectedVersions: string[];
  selectedEngines: string[];
  selectedBodyTypes: string[];
  selectedDoors: number[];
  selectedTrunks: string[];
  onConditionChange: (condition: "new" | "used" | undefined) => void;
  onBrandChange: (slug: string) => void;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onPriceBlur: () => void;
  onGenerationToggle: (label: string, since: number, until: number) => void;
  onVersionToggle: (version: string) => void;
  onEngineToggle: (engine: string) => void;
  onFuelToggle: (slug: string) => void;
  onBodyTypeToggle: (slug: string) => void;
  onDoorToggle: (door: number) => void;
  onTrunkToggle: (trunk: string) => void;
  onTractionToggle: (slug: string) => void;
  onReset: () => void;
  className?: string;
};

function FilterTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-slate-900">{children}</h3>;
}

function CheckboxRow({
  label,
  checked,
  onChange,
  align = "left",
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  align?: "left" | "right";
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-slate-600",
        align === "right" && "justify-between",
      )}
    >
      {align === "left" && (
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 rounded border-slate-300 text-[#0061F2] focus:ring-[#0061F2]"
        />
      )}
      <span>{label}</span>
      {align === "right" && (
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 rounded border-slate-300 text-[#0061F2] focus:ring-[#0061F2]"
        />
      )}
    </label>
  );
}

export function VehiclesSidebar({
  filters,
  priceMin,
  priceMax,
  selectedBrand,
  selectedGenerations,
  selectedVersions,
  selectedEngines,
  selectedBodyTypes,
  selectedDoors,
  selectedTrunks,
  onConditionChange,
  onBrandChange,
  onPriceMinChange,
  onPriceMaxChange,
  onPriceBlur,
  onGenerationToggle,
  onVersionToggle,
  onEngineToggle,
  onFuelToggle,
  onBodyTypeToggle,
  onDoorToggle,
  onTrunkToggle,
  onTractionToggle,
  onReset,
  className,
}: VehiclesSidebarProps) {
  const sliderMin = Number(priceMin) || DEFAULT_PRICE_RANGE.min;
  const sliderMax = Number(priceMax) || DEFAULT_PRICE_RANGE.max;

  return (
    <aside className={cn("w-full shrink-0 lg:w-72 xl:w-80", className)}>
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Filtros</h2>
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-[#0061F2] hover:underline"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="max-h-[calc(100vh-12rem)] space-y-6 overflow-y-auto px-5 py-5">
          <section>
            <FilterTitle>Tip De Carro</FilterTitle>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["new", "used"] as const).map((value) => {
                const label = value === "new" ? "Nuevo" : "Usado";
                const active = filters.condition === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onConditionChange(active ? undefined : value)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "border-[#0061F2] text-[#0061F2]"
                        : "border-slate-200 text-slate-500 hover:border-slate-300",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <FilterTitle>Marca</FilterTitle>
            <div className="mt-3 space-y-0.5">
              {BRAND_OPTIONS.map(({ slug, label }) => (
                <CheckboxRow
                  key={slug || "all"}
                  label={label}
                  checked={selectedBrand === slug}
                  onChange={() => onBrandChange(slug)}
                  align="right"
                />
              ))}
            </div>
          </section>

          <section>
            <FilterTitle>Rango De Precio</FilterTitle>
            <div className="mt-4 space-y-3">
              <input
                type="range"
                min={DEFAULT_PRICE_RANGE.min}
                max={DEFAULT_PRICE_RANGE.max}
                value={Math.min(sliderMax, DEFAULT_PRICE_RANGE.max)}
                onChange={(e) => onPriceMaxChange(e.target.value)}
                onMouseUp={onPriceBlur}
                onTouchEnd={onPriceBlur}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#0061F2]"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => onPriceMinChange(e.target.value)}
                  onBlur={onPriceBlur}
                  placeholder="Mín"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#0061F2]"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => onPriceMaxChange(e.target.value)}
                  onBlur={onPriceBlur}
                  placeholder="Máx"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#0061F2]"
                />
              </div>
            </div>
          </section>

          <section>
            <FilterTitle>Generación</FilterTitle>
            <div className="mt-3 space-y-0.5">
              {GENERATION_OPTIONS.map(({ label, since, until }) => (
                <CheckboxRow
                  key={label}
                  label={label}
                  checked={selectedGenerations.includes(label)}
                  onChange={() => onGenerationToggle(label, since, until)}
                  align="right"
                />
              ))}
            </div>
          </section>

          <section>
            <FilterTitle>Versión</FilterTitle>
            <div className="mt-3 space-y-0.5">
              {VERSION_OPTIONS.map((version) => (
                <CheckboxRow
                  key={version}
                  label={version}
                  checked={selectedVersions.includes(version)}
                  onChange={() => onVersionToggle(version)}
                  align="right"
                />
              ))}
            </div>
          </section>

          <section>
            <FilterTitle>Motorización</FilterTitle>
            <div className="mt-3 space-y-0.5">
              {ENGINE_OPTIONS.map((engine) => (
                <CheckboxRow
                  key={engine}
                  label={engine}
                  checked={selectedEngines.includes(engine)}
                  onChange={() => onEngineToggle(engine)}
                  align="right"
                />
              ))}
            </div>
          </section>

          <section>
            <FilterTitle>Combustible</FilterTitle>
            <div className="mt-3 space-y-0.5">
              {FUEL_OPTIONS.map(({ label, slug }) => (
                <CheckboxRow
                  key={slug}
                  label={label}
                  checked={(filters.fuel_type_slugs ?? []).includes(slug)}
                  onChange={() => onFuelToggle(slug)}
                  align="right"
                />
              ))}
            </div>
          </section>

          <section>
            <FilterTitle>Carrocería</FilterTitle>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {BODY_TYPE_OPTIONS.map(({ slug, label }) => {
                const active = selectedBodyTypes.includes(slug);
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => onBodyTypeToggle(slug)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-xs font-semibold transition-colors",
                      active
                        ? "border-[#0061F2] text-[#0061F2]"
                        : "border-slate-200 text-slate-500 hover:border-slate-300",
                    )}
                  >
                    <Car className="size-8 text-slate-400" strokeWidth={1.25} />
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <FilterTitle>Número De Puertas</FilterTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {DOOR_OPTIONS.map((door) => {
                const active = selectedDoors.includes(door);
                return (
                  <button
                    key={door}
                    type="button"
                    onClick={() => onDoorToggle(door)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                      active
                        ? "border-[#0061F2] text-[#0061F2]"
                        : "border-slate-200 text-slate-500 hover:border-slate-300",
                    )}
                  >
                    {door}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <FilterTitle>Maletero</FilterTitle>
            <div className="mt-3 space-y-0.5">
              {TRUNK_OPTIONS.map((trunk) => (
                <CheckboxRow
                  key={trunk}
                  label={trunk}
                  checked={selectedTrunks.includes(trunk)}
                  onChange={() => onTrunkToggle(trunk)}
                  align="right"
                />
              ))}
            </div>
          </section>

          <section>
            <FilterTitle>Tracción</FilterTitle>
            <div className="mt-3 space-y-0.5">
              {TRACTION_OPTIONS.map(({ label, slug }) => (
                <CheckboxRow
                  key={slug}
                  label={label}
                  checked={(filters.traction_slugs ?? []).includes(slug)}
                  onChange={() => onTractionToggle(slug)}
                  align="right"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}

export { BRAND_BLUE, BRAND_BLUE_LIGHT };
