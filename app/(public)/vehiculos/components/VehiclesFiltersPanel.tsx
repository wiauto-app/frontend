"use client";

import { useMemo, useState } from "react";

import { ConditionSelector } from "@/components/selectors/conditionSelector";
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
import type {
  PriceFilterValue,
  PublisherTypesValue,
} from "@/components/selectors/types";
import type { FiltersResponse } from "@/interfaces/filters.interface";
import type {
  ConditionVehicle,
  TransmissionType,
} from "@/interfaces/vehicle.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationSelector } from "@/components/selectors/locationSelector";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { FILTER_SECTION_IDS } from "../utils/getExpandedFilterSectionIds";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FilterItem } from "./filterItem";
import { VehicleTypeSelector } from "./vehicleTypeSelector";
import { FiltersMakeSelector } from "@/components/selectors/FilterMakeSelector/filtersMakeSelector";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import { PUBLISHER_TYPE_KEY } from "../[[...slug]]/constants/filterKeys.constants";
import {
  HiOutlineCalendar,
  HiOutlineHome,
  HiOutlineCurrencyEuro,
  HiOutlineShoppingCart,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { FaGauge } from "react-icons/fa6";
import { TbEngine } from "react-icons/tb";
import {
  LuBatteryCharging,
  LuCar,
  LuLeaf,
  LuPaintRoller,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

interface VehiclesFiltersPanelProps {
  catalog: FiltersResponse;
}

export const VehiclesFiltersPanel = ({
  catalog,
}: VehiclesFiltersPanelProps) => {
  const { filters, commitFilters } = useVehiclesListingFilters();
  const { values, handleMultiChange } = useFiltersManager({
    keys: [PUBLISHER_TYPE_KEY],
  });
  const publisher_types = values[PUBLISHER_TYPE_KEY] as PublisherTypesValue;

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

  const iconSize = 24;

  return (
    <Card size="sm" className="min-w-85 rounded-t-none">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-5")}>
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

        <FilterItem
          sectionId={FILTER_SECTION_IDS.CONDITION}
          title="Estado"
          Icon={<HiOutlineTag size={iconSize} />}
        >
          <ConditionSelector
            value={filters.condition}
            onChange={(next?: ConditionVehicle) =>
              commitFilters({
                ...filters,
                condition: next,
                page: 1,
              })
            }
          />
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.MAKE_MODEL}
          title="Marca y Modelo"
          Icon={<HiOutlineHome size={iconSize} />}
        >
          <FiltersMakeSelector />
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.PRICE}
          title="Precio"
          Icon={<HiOutlineCurrencyEuro size={iconSize} />}
        >
          <PriceSelector
            cuotas={catalog.cuotas}
            value={price_value}
            onChange={handlePriceChange}
          />
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.LOCATION}
          title="Ubicación"
          Icon={<HiOutlineMapPin size={iconSize} />}
        >
          <LocationSelector />
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.SERVICES}
          title="Servicios"
          Icon={<HiOutlineShoppingCart size={iconSize} />}
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
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.SELLERS}
          title="Vendedores"
          Icon={<HiOutlineUser size={iconSize} />}
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
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.YEAR}
          title="Año"
          Icon={<HiOutlineCalendar size={iconSize} />}
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
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.MILEAGE}
          title="Kilometraje"
          Icon={<FaGauge size={iconSize} />}
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
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.ENGINE}
          title="Motor"
          Icon={<TbEngine size={iconSize} />}
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
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.ELECTRIC}
          title="Eléctricos"
          Icon={<LuBatteryCharging size={iconSize} />}
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
        </FilterItem>
        <Separator />

        <FilterItem
          sectionId={FILTER_SECTION_IDS.DGT}
          title="Etiquetas DGT"
          Icon={<LuLeaf size={iconSize} />}
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
        </FilterItem>
        <Separator />

        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.FEATURES}
          title="Equipamiento"
          Icon={<LuCar size={iconSize} />}
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
        </FilterItem>
        <Separator />
        <FilterItem
          sectionId={FILTER_SECTION_IDS.COLOR}
          title="Color"
          Icon={<LuPaintRoller size={iconSize} />}
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
        </FilterItem>
      </CardContent>
    </Card>
  );
};
