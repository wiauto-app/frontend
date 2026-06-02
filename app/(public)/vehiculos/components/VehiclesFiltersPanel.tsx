"use client";

import { useMemo, useState } from "react";
import {
  BatteryChargingIcon,
  Building2Icon,
  CalendarIcon,
  Car,
  CarIcon,
  DollarSignIcon,
  GaugeIcon,
  Leaf,
  MapPinIcon,
  PaintRoller,
  ShoppingCart,
  UserIcon,
} from "lucide-react";

import { MakeSelector } from "@/components/selectors/makeSelector";
import { PriceSelector } from "@/components/selectors/priceSelector";
import { ServicesSelector } from "@/components/selectors/servicesSelector";
import { SellersSelector } from "@/components/selectors/sellersSelector";
import { YearSelector } from "@/components/selectors/yearSelector";
import { KmSelector } from "@/components/selectors/kmSelector";
import { EngineSelector } from "@/components/selectors/engineSelector";
import { DgtLabelSelector } from "@/components/selectors/dgtLabelSelector";
import { ColorSelector } from "@/components/selectors/colorSelector";
import { FeaturesSelector } from "@/components/selectors/featuresSelector";
import { ElectricSelector } from "@/components/selectors/electricSelector";
import type { PriceFilterValue } from "@/components/selectors/types";
import type { FiltersResponse } from "@/interfaces/filters.interface";
import type {
  PublisherType,
  TransmissionType,
} from "@/interfaces/vehicle.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LocationSelector,
  type LocationFilterValue,
} from "@/components/selectors/locationSelector";

import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";

import { FilterAccordeon } from "./filterAccordeon";
import { VehicleTypeSelector } from "./vehicleTypeSelector";

type VehiclesFiltersPanelProps = {
  catalog: FiltersResponse;
};

export const VehiclesFiltersPanel = ({
  catalog,
}: VehiclesFiltersPanelProps) => {
  const { filters, commitFilters, handleMakeModelChange } =
    useVehiclesListingFilters();

  const [type_slug, setTypeSlug] = useState<string | undefined>(
    filters.type_slug,
  );
  const [publisher_types, setPublisherTypes] = useState<PublisherType[]>(
    filters.publisher_types ?? [],
  );
  const [battery_until, setBatteryUntil] = useState<number | undefined>(
    filters.battery_capacity_until,
  );

  const make_model = useMemo(
    () => ({
      make_slug: filters.makes_slugs?.[0],
      model_slug: filters.models_slugs?.[0],
    }),
    [filters.makes_slugs, filters.models_slugs],
  );

  const location_value = useMemo(
    (): LocationFilterValue => ({
      province_slug: filters.provinces_slugs?.[0],
      municipality_slug: filters.municipalities_slugs?.[0],
    }),
    [filters.municipalities_slugs, filters.provinces_slugs],
  );

  const facet_query_params = useMemo(
    () => ({
      make_slug: filters.makes_slugs?.[0],
      model_slug: filters.models_slugs?.[0],
      province_slug: filters.provinces_slugs?.[0],
      until_price: filters.until_price,
    }),
    [
      filters.makes_slugs,
      filters.models_slugs,
      filters.provinces_slugs,
      filters.until_price,
    ],
  );

  const year_range = useMemo(
    () => ({
      since: filters.since_year,
      until: filters.until_year,
    }),
    [filters.since_year, filters.until_year],
  );

  const km_range = useMemo(
    () => ({
      since: filters.since_mileage,
      until: filters.until_mileage,
    }),
    [filters.since_mileage, filters.until_mileage],
  );

  const price_value = useMemo((): PriceFilterValue => {
    const has_cuota = Boolean(filters.cuota_slugs?.length);
    return {
      since: has_cuota
        ? filters.since_price
        : (filters.since_price ?? undefined),
      until: has_cuota
        ? filters.until_price
        : (filters.until_price ?? undefined),
      cuota_slug: filters.cuota_slugs?.[0],
    };
  }, [filters.cuota_slugs, filters.since_price, filters.until_price]);

  const battery_range = useMemo(
    () => ({
      since: filters.battery_capacity_since,
      until: battery_until,
    }),
    [battery_until, filters.battery_capacity_since],
  );

  const handlePriceChange = (next: PriceFilterValue) => {
    const has_cuota = Boolean(next.cuota_slug);
    commitFilters({
      ...filters,
      since_price: next.since,
      until_price: next.until,
      cuota_slugs: next.cuota_slug ? [next.cuota_slug] : undefined,
      page: 1,
      ...(has_cuota
        ? {}
        : {
            cuota_slugs: undefined,
          }),
    });
  };

  const handleLocationChange = (next: LocationFilterValue) => {
    commitFilters({
      ...filters,
      provinces_slugs: next.province_slug ? [next.province_slug] : undefined,
      municipalities_slugs: next.municipality_slug
        ? [next.municipality_slug]
        : undefined,
      page: 1,
    });
  };

  const handleBatteryChange = (next: { since?: number; until?: number }) => {
    setBatteryUntil(next.until);
    commitFilters({
      ...filters,
      battery_capacity_since: next.since,
      battery_capacity_until: next.until,
      page: 1,
    });
  };

  return (
    <Card className="rounded-none" size="sm">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <FilterAccordeon title="Tipo de vehículo" Icon={CarIcon}>
          <VehicleTypeSelector
            vehicleTypes={catalog.vehicleTypes}
            value={type_slug}
            onChange={(next) => {
              setTypeSlug(next);
              commitFilters({
                ...filters,
                type_slug: next,
                page: 1,
              });
            }}
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Marca y Modelo" Icon={Building2Icon}>
          <MakeSelector
            value={make_model}
            onValueChange={handleMakeModelChange}
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Precio" Icon={DollarSignIcon}>
          <PriceSelector
            cuotas={catalog.cuotas}
            value={price_value}
            onChange={handlePriceChange}
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Ubicación" Icon={MapPinIcon}>
          <LocationSelector
            value={location_value}
            onChange={handleLocationChange}
            facetQueryParams={facet_query_params}
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Servicios" Icon={ShoppingCart}>
          <ServicesSelector
            services={catalog.services}
            value={filters.service_slugs ?? []}
            onChange={(next) =>
              commitFilters({
                ...filters,
                service_slugs: next.length > 0 ? next : undefined,
                page: 1,
              })
            }
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Vendedores" Icon={UserIcon}>
          <SellersSelector
            value={publisher_types}
            onChange={(next) => {
              setPublisherTypes(next);
              commitFilters({
                ...filters,
                publisher_types: next.length > 0 ? next : undefined,
                page: 1,
              });
            }}
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Año" Icon={CalendarIcon}>
          <YearSelector
            value={year_range}
            onChange={(range) =>
              commitFilters({
                ...filters,
                since_year: range.since,
                until_year: range.until,
                page: 1,
              })
            }
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Kilometraje" Icon={GaugeIcon}>
          <KmSelector
            value={km_range}
            onChange={(range) =>
              commitFilters({
                ...filters,
                since_mileage: range.since,
                until_mileage: range.until,
                page: 1,
              })
            }
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Motor" Icon={GaugeIcon}>
          <EngineSelector
            fuelTypes={catalog.fuels}
            tractions={catalog.tractions}
            fuelTypeSlugs={filters.fuel_type_slugs ?? []}
            onFuelTypeSlugsChange={(next) =>
              commitFilters({
                ...filters,
                fuel_type_slugs: next.length > 0 ? next : undefined,
                page: 1,
              })
            }
            tractionSlugs={filters.traction_slugs ?? []}
            onTractionSlugsChange={(next) =>
              commitFilters({
                ...filters,
                traction_slugs: next.length > 0 ? next : undefined,
                page: 1,
              })
            }
            transmissionTypes={
              (filters.transmission_types ?? []) as TransmissionType[]
            }
            onTransmissionTypesChange={(next) =>
              commitFilters({
                ...filters,
                transmission_types: next.length > 0 ? next : undefined,
                page: 1,
              })
            }
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Etiquetas DGT" Icon={Leaf}>
          <DgtLabelSelector
            dgtLabels={catalog.dgtLabels}
            value={filters.dgt_label_ids ?? []}
            onChange={(next) =>
              commitFilters({
                ...filters,
                dgt_label_ids: next.length > 0 ? next : undefined,
                page: 1,
              })
            }
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Eléctricos" Icon={BatteryChargingIcon}>
          <ElectricSelector
            autonomyValue={filters.autonomy_since}
            onAutonomyChange={(value) =>
              commitFilters({
                ...filters,
                autonomy_since: value,
                page: 1,
              })
            }
            batteryValue={battery_range}
            onBatteryChange={handleBatteryChange}
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Equipamiento" Icon={Car}>
          <FeaturesSelector
            features={catalog.features}
            value={filters.features_slugs ?? []}
            onChange={(next) =>
              commitFilters({
                ...filters,
                features_slugs: next.length > 0 ? next : undefined,
                page: 1,
              })
            }
          />
        </FilterAccordeon>
        <Separator />
        <FilterAccordeon title="Color" Icon={PaintRoller}>
          <ColorSelector
            colors={catalog.colors}
            value={filters.color_slugs ?? []}
            onChange={(next) =>
              commitFilters({
                ...filters,
                color_slugs: next.length > 0 ? next : undefined,
                page: 1,
              })
            }
          />
        </FilterAccordeon>
      </CardContent>
    </Card>
  );
};
