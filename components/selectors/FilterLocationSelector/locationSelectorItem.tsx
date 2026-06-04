"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { CustomCheckbox } from "../../ui/customCheckbox";
import { Separator } from "../../ui/separator";
import { MakeSelectorItemSkeleton } from "../FilterMakeSelector/makeSelectorItemSkeleton";

import {
  LocationSelectedItem,
  LocationSelectorItemProps,
} from "./interfaces/locationSelector.interface";
import { useSelectedLocationItemsStore } from "./stores/selectedLocationItemsStore";
import {
  buildLocationUrlPayload,
  isFullProvinceMunicipalitySelection,
  normalizeSelectedItemsForProvince,
} from "./utils/location-selection";

import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import {
  GEO_LOCATION_KEYS,
  MUNICIPALITY_KEY,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";

export const LocationSelectorItem = ({
  isLoading,
  municipalities,
  item,
  selectedProvinces,
  setSelectedProvinces,
  selectedItems: controlledSelectedItems,
  setSelectedItems: controlledSetSelectedItems,
  onApplyLocationPayload,
}: LocationSelectorItemProps) => {
  const store = useSelectedLocationItemsStore();
  const selectedItems = controlledSelectedItems ?? store.selectedItems;
  const setSelectedItems = controlledSetSelectedItems ?? store.setSelectedItems;
  const { applyUrlUpdates } = useFiltersManager({
    keys: [PROVINCE_KEY, MUNICIPALITY_KEY],
  });
  const municipalitiesByProvince = municipalities.filter(
    (municipality) => municipality.province_id === item.id,
  );

  const selected_municipality_slugs_for_province = selectedItems
    .filter(
      (selectedItem) =>
        selectedItem.type === "municipality" &&
        selectedItem.province_id === item.id,
    )
    .map((selectedItem) => selectedItem.slug);

  const is_province_all_selected =
    selectedItems.some(
      (selectedItem) =>
        selectedItem.type === "province" &&
        selectedItem.province_id === item.id,
    ) ||
    isFullProvinceMunicipalitySelection(
      selected_municipality_slugs_for_province,
      municipalitiesByProvince,
    );

  const applySelectionAndUrl = (next_items: LocationSelectedItem[]) => {
    const normalized = normalizeSelectedItemsForProvince(
      next_items,
      item,
      municipalitiesByProvince,
    );

    setSelectedItems(normalized);

    const payload = buildLocationUrlPayload(normalized);

    if (onApplyLocationPayload) {
      onApplyLocationPayload(payload);
      return;
    }

    applyUrlUpdates({
      [PROVINCE_KEY]: payload[PROVINCE_KEY],
      [MUNICIPALITY_KEY]: payload[MUNICIPALITY_KEY],
      [GEO_LOCATION_KEYS.LAT]: undefined,
      [GEO_LOCATION_KEYS.LNG]: undefined,
      [GEO_LOCATION_KEYS.RADIUS]: undefined,
    });
  };

  const handleExpandProvince = () => {
    if (selectedProvinces.find((province) => province.slug === item.slug)) {
      setSelectedProvinces(
        selectedProvinces.filter((province) => province.slug !== item.slug),
      );
    } else {
      setSelectedProvinces([...selectedProvinces, item]);
    }
  };

  const handleSelectProvince = (checked: boolean) => {
    if (checked) {
      const next_items: LocationSelectedItem[] = [
        ...selectedItems.filter(
          (selectedItem) =>
            !(
              selectedItem.type === "province" &&
              selectedItem.province_id === item.id
            ) &&
            !(
              selectedItem.type === "municipality" &&
              selectedItem.province_id === item.id
            ),
        ),
        {
          value: true,
          type: "province",
          slug: item.slug,
          province_id: item.id,
        },
      ];

      applySelectionAndUrl(next_items);
    } else {
      const next_items = selectedItems.filter(
        (selectedItem) =>
          !(
            selectedItem.type === "province" &&
            selectedItem.province_id === item.id
          ) &&
          !(
            selectedItem.type === "municipality" &&
            selectedItem.province_id === item.id
          ),
      );

      applySelectionAndUrl(next_items);
    }
  };

  const handleSelectMunicipality = (
    checked: boolean,
    municipality: HeroCatalogFacetItem,
  ) => {
    const province_id = municipality.province_id ?? item.id;
    const next_items = checked
      ? [
          ...selectedItems.filter(
            (selectedItem) =>
              !(
                selectedItem.type === "municipality" &&
                selectedItem.slug === municipality.slug
              ) &&
              !(
                selectedItem.type === "province" &&
                selectedItem.province_id === province_id
              ),
          ),
          {
            value: true,
            type: "municipality" as const,
            slug: municipality.slug,
            province_id,
          },
        ]
      : selectedItems.filter(
          (selectedItem) =>
            !(
              selectedItem.type === "municipality" &&
              selectedItem.slug === municipality.slug
            ),
        );

    applySelectionAndUrl(next_items);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={handleExpandProvince}
        className="flex cursor-pointer items-center justify-between gap-2 rounded-md p-2 hover:bg-muted"
      >
        {item.name}

        <div className="flex items-center gap-2">
          <span>{item.vehicle_count}</span>

          {selectedProvinces.find((province) => province.slug === item.slug) ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </div>
      </div>

      {selectedProvinces.find((province) => province.slug === item.slug) && (
        <div className="flex flex-col gap-2 rounded-md bg-muted p-2">
          {isLoading ? (
            <MakeSelectorItemSkeleton />
          ) : (
            <>
              <CustomCheckbox
                checked={is_province_all_selected}
                onChange={(e) => handleSelectProvince(e.target.checked)}
                label="Todos"
              />

              <Separator />

              {municipalitiesByProvince.map((municipality) => {
                const isMunicipalitySelected = selectedItems.some(
                  (selectedItem) =>
                    selectedItem.type === "municipality" &&
                    selectedItem.slug === municipality.slug,
                );

                return (
                  <CustomCheckbox
                    key={municipality.id}
                    checked={is_province_all_selected || isMunicipalitySelected}
                    disabled={is_province_all_selected}
                    onChange={(e) =>
                      handleSelectMunicipality(e.target.checked, municipality)
                    }
                    label={
                      <div className="flex w-full items-center justify-between">
                        <p>{municipality.name}</p>

                        <span className="text-xs text-muted-foreground">
                          {municipality.vehicle_count}
                        </span>
                      </div>
                    }
                  />
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};
