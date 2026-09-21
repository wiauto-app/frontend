"use client";

import { useEffect, useMemo, useState } from "react";

import { ConditionSelector } from "@/components/selectors/conditionSelector";
import { PriceSelector } from "@/components/selectors/priceSelector";
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
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { FILTER_SECTION_IDS } from "../utils/getExpandedFilterSectionIds";
import { useActiveFiltersStore } from "../stores/activeFiltersStore";

import { Separator } from "@/components/ui/separator";
import { FilterItem } from "./filterItem";
import { VehicleTypeSelector } from "./vehicleTypeSelector";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import {
  MAKE_KEY,
  MODEL_KEY,
  PROVINCE_KEY,
  PUBLISHER_TYPE_KEY,
  VEHICLE_TYPE_KEY,
} from "../[[...slug]]/constants/filterKeys.constants";
import {
  HiOutlineCalendar,
  HiOutlineHome,
  HiOutlineCurrencyEuro,
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
import { HeroFiltersMakeSelector } from "@/components/home/HeroFiltersMakeSelector";
import { HeroFiltersLocationSelector } from "@/components/home/HeroFiltersLocationSelector";
import { useHeroSearchFilters } from "@/components/home/HeroSearchFiltersContext";
import type { MakeModelUrlPayload } from "@/components/selectors/FilterMakeSelector/utils/make-model-selection";

interface VehiclesFiltersPanelProps {
  catalog: FiltersResponse;
}

const mapActiveItemToFacet = (item: {
  id: string | number;
  slug: string;
  name: string;
  make_id?: number;
}): HeroCatalogFacetItem => ({
  id: Number(item.id),
  slug: item.slug,
  name: item.name,
  vehicle_count: 0,
  make_id: item.make_id,
});

export const VehiclesFiltersPanel = ({
  catalog,
}: VehiclesFiltersPanelProps) => {
  const { filters, commitFilters } = useVehiclesListingFilters();
  const { replaceMakeModelSelection } = useHeroSearchFilters();
  const { activeFilters } = useActiveFiltersStore();
  const { values, handleMultiChange, handleChange } = useFiltersManager({
    keys: [PUBLISHER_TYPE_KEY, PROVINCE_KEY, VEHICLE_TYPE_KEY],
  });
  const provinces = values[PROVINCE_KEY] as string[];
  const publisher_types = values[PUBLISHER_TYPE_KEY] as PublisherTypesValue;
  const type_slug = values[VEHICLE_TYPE_KEY] as string;

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
    return {
      since: filters.since_price,
      until: filters.until_price,
    };
  }, [filters.since_price, filters.until_price]);

  const battery_range = useMemo(
    () => ({
      since: filters.battery_capacity_since,
      until: battery_until,
    }),
    [battery_until, filters.battery_capacity_since],
  );

  const make_slugs_key = (filters.makes_slugs ?? []).join(",");
  const model_slugs_key = (filters.models_slugs ?? []).join(",");

  // Hidrata el selector hero desde la URL / filtros activos del listado.
  useEffect(() => {
    const make_slugs = filters.makes_slugs ?? [];
    const model_slugs = filters.models_slugs ?? [];

    if (make_slugs.length === 0 && model_slugs.length === 0) {
      replaceMakeModelSelection([], []);
      return;
    }

    const resolved_makes = activeFilters?.resolved.makes ?? [];
    const resolved_models = activeFilters?.resolved.models ?? [];

    const makes: HeroCatalogFacetItem[] =
      resolved_makes.length > 0
        ? resolved_makes.map(mapActiveItemToFacet)
        : make_slugs.map((slug, index) => ({
            id: -(index + 1),
            slug,
            name: slug,
            vehicle_count: 0,
          }));

    const models: HeroCatalogFacetItem[] =
      resolved_models.length > 0
        ? resolved_models.map((item) => ({
            ...mapActiveItemToFacet(item),
            make_id: item.make_id,
          }))
        : model_slugs.map((slug, index) => ({
            id: -(index + 1000),
            slug,
            name: slug,
            vehicle_count: 0,
          }));

    replaceMakeModelSelection(makes, models);
  }, [
    activeFilters?.resolved.makes,
    activeFilters?.resolved.models,
    filters.makes_slugs,
    filters.models_slugs,
    make_slugs_key,
    model_slugs_key,
    replaceMakeModelSelection,
  ]);

  const handlePriceChange = (next: PriceFilterValue) => {
    commitFilters({
      ...filters,
      since_price: next.since,
      until_price: next.until,
      cuota_slugs: undefined,
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

  const handleMakeModelApply = (payload: MakeModelUrlPayload) => {
    commitFilters({
      ...filters,
      makes_slugs: payload[MAKE_KEY],
      models_slugs: payload[MODEL_KEY],
      page: 1,
    });
  };

  const iconSize = 24;

  return (
    <>
      <VehicleTypeSelector
        vehicleTypes={catalog.vehicleTypes}
        value={type_slug}
        onChange={(next) => {
          handleChange(VEHICLE_TYPE_KEY, next ?? undefined);
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
        <HeroFiltersMakeSelector onApply={handleMakeModelApply} />
      </FilterItem>
      <Separator />
      <FilterItem
        sectionId={FILTER_SECTION_IDS.PRICE}
        title="Precio"
        Icon={<HiOutlineCurrencyEuro size={iconSize} />}
      >
        <PriceSelector value={price_value} onChange={handlePriceChange} />
      </FilterItem>
      <Separator />
      <FilterItem
        sectionId={FILTER_SECTION_IDS.LOCATION}
        title="Ubicación"
        Icon={<HiOutlineMapPin size={iconSize} />}
      >
        <HeroFiltersLocationSelector
          value={typeof provinces === "string" ? [provinces] : provinces}
          onChange={(next) => {
            handleMultiChange(
              PROVINCE_KEY,
              typeof next === "string" ? [next] : next,
            );
          }}
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
            handleMultiChange(PUBLISHER_TYPE_KEY, next as PublisherTypesValue);
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
    </>
  );
};
