"use client";

import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
import {
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
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { MakeSelector } from "@/components/selectors/makeSelector";

type VehiclesSidebarProps = {
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

export function VehiclesSidebar({ className }: VehiclesSidebarProps) {
  const {
    filters,
    priceMin,
    priceMax,
    selectedGenerations,
    selectedVersions,
    selectedEngines,
    selectedBodyTypes,
    selectedDoors,
    selectedTrunks,
    handleConditionChange,
    handleBrandToggle,
    handlePriceMinChange,
    handlePriceMaxChange,
    handlePriceBlur,
    handleGenerationToggle,
    handleVersionToggle,
    handleEngineToggle,
    handleFuelToggle,
    handleBodyTypeToggle,
    handleDoorToggle,
    handleTrunkToggle,
    handleTractionToggle,
    handleMakeModelChange,
    resetFilters,
  } = useVehiclesListingFilters();

  const selectedBrands = filters.makes_slugs ?? [];
  const sliderMax = Number(priceMax) || DEFAULT_PRICE_RANGE.max;

  return (
    <aside
      className={cn(
        "sticky top-20 w-full shrink-0 self-start lg:w-72 xl:w-80",
        className,
      )}
    >
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Filtros</h2>
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-[#0061F2] hover:underline"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto px-5 py-5">
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
                    onClick={() =>
                      handleConditionChange(active ? undefined : value)
                    }
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
            <MakeSelector
              value={{
                make_slug: filters.makes_slugs?.[0],
                model_slug: filters.models_slugs?.[0],
              }}
              onValueChange={handleMakeModelChange}
            />
          </section>

          <section>
            <FilterTitle>Rango De Precio</FilterTitle>
            <div className="mt-4 space-y-3">
              <input
                type="range"
                min={DEFAULT_PRICE_RANGE.min}
                max={DEFAULT_PRICE_RANGE.max}
                value={Math.min(sliderMax, DEFAULT_PRICE_RANGE.max)}
                onChange={(e) => handlePriceMaxChange(e.target.value)}
                onMouseUp={handlePriceBlur}
                onTouchEnd={handlePriceBlur}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#0061F2]"
                aria-label="Precio máximo"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => handlePriceMinChange(e.target.value)}
                  onBlur={handlePriceBlur}
                  placeholder="Mín"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#0061F2]"
                  aria-label="Precio mínimo"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => handlePriceMaxChange(e.target.value)}
                  onBlur={handlePriceBlur}
                  placeholder="Máx"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#0061F2]"
                  aria-label="Precio máximo"
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
                  onChange={() => handleGenerationToggle(label, since, until)}
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
                  onChange={() => handleVersionToggle(version)}
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
                  onChange={() => handleEngineToggle(engine)}
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
                  onChange={() => handleFuelToggle(slug)}
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
                    onClick={() => handleBodyTypeToggle(slug)}
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
                    onClick={() => handleDoorToggle(door)}
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
                  onChange={() => handleTrunkToggle(trunk)}
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
                  onChange={() => handleTractionToggle(slug)}
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
