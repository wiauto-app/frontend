"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useParams, useSearchParams } from "next/navigation";

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
import type { PriceFilterValue, PublisherTypesValue } from "@/components/selectors/types";
import type { FiltersResponse } from "@/interfaces/filters.interface";
import type { TransmissionType } from "@/interfaces/vehicle.interface";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LocationSelector } from "@/components/selectors/locationSelector";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import {
  FILTER_SECTION_IDS,
  getExpandedFilterSectionIds,
} from "../utils/getExpandedFilterSectionIds";

import { FilterAccordeon } from "./filterAccordeon";
import { VehicleTypeSelector } from "./vehicleTypeSelector";
import { FiltersMakeSelector } from "@/components/selectors/FilterMakeSelector/filtersMakeSelector";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import { PUBLISHER_TYPE_KEY } from "../[[...slug]]/constants/filterKeys.constants";

type VehiclesFiltersPanelProps = {
  catalog: FiltersResponse;
};

const resolveSlugArray = (slug: string | string[] | undefined): string[] => {
  if (!slug) {
    return [];
  }
  return Array.isArray(slug) ? slug : [slug];
};

export const VehiclesFiltersPanel = ({
  catalog,
}: VehiclesFiltersPanelProps) => {
  const { filters, commitFilters } = useVehiclesListingFilters();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const slugSegments = resolveSlugArray(routeParams.slug);
  const urlKey = `${slugSegments.join("/")}?${searchParams.toString()}`;

  const { values, handleMultiChange } = useFiltersManager({
    keys: [PUBLISHER_TYPE_KEY],
  });
  const publisher_types = values[PUBLISHER_TYPE_KEY] as PublisherTypesValue;

  const expandedFromFilters = useMemo(
    () => getExpandedFilterSectionIds(filters),
    [filters],
  );
  const [openSections, setOpenSections] = useState(expandedFromFilters);

  useEffect(() => {
    setOpenSections(expandedFromFilters);
  }, [urlKey, expandedFromFilters]);

  const [type_slug, setTypeSlug] = useState<string | undefined>(
    filters.type_slug,
  );

  const [battery_until, setBatteryUntil] = useState<number | undefined>(
    filters.battery_capacity_until,
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
        <Accordion
          multiple
          value={openSections}
          onValueChange={setOpenSections}
        >
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.VEHICLE_TYPE}
            title="Tipo de vehículo"
            Icon={CarIcon}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.MAKE_MODEL}
            title="Marca y Modelo"
            Icon={Building2Icon}
          >
            <FiltersMakeSelector />
          </FilterAccordeon>
          <Separator />
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.PRICE}
            title="Precio"
            Icon={DollarSignIcon}
          >
            <PriceSelector
              cuotas={catalog.cuotas}
              value={price_value}
              onChange={handlePriceChange}
            />
          </FilterAccordeon>
          <Separator />
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.LOCATION}
            title="Ubicación"
            Icon={MapPinIcon}
          >
            <LocationSelector />
          </FilterAccordeon>
          <Separator />
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.SERVICES}
            title="Servicios"
            Icon={ShoppingCart}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.SELLERS}
            title="Vendedores"
            Icon={UserIcon}
          >
            <SellersSelector
              value={publisher_types}
              onChange={(next) => {
                handleMultiChange(
                  PUBLISHER_TYPE_KEY,
                  next as PublisherTypesValue,
                );
              }}
            />
          </FilterAccordeon>
          <Separator />
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.YEAR}
            title="Año"
            Icon={CalendarIcon}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.MILEAGE}
            title="Kilometraje"
            Icon={GaugeIcon}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.ENGINE}
            title="Motor"
            Icon={GaugeIcon}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.DGT}
            title="Etiquetas DGT"
            Icon={Leaf}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.ELECTRIC}
            title="Eléctricos"
            Icon={BatteryChargingIcon}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.FEATURES}
            title="Equipamiento"
            Icon={Car}
          >
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
          <FilterAccordeon
            sectionId={FILTER_SECTION_IDS.COLOR}
            title="Color"
            Icon={PaintRoller}
          >
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
        </Accordion>
      </CardContent>
    </Card>
  );
};
