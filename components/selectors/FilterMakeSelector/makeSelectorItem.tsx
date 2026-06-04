"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { CustomCheckbox } from "../../ui/customCheckbox";
import { Separator } from "../../ui/separator";

import { MakeSelectorItemSkeleton } from "./makeSelectorItemSkeleton";
import {
  MakeSelectorItemProps,
  SelectedItem,
} from "./interfaces/makeSelector.interface";
import { useSelectedItemsStore } from "./stores/selectedItemsStore";

import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import {
  MAKE_KEY,
  MODEL_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import {
  buildMakeModelUrlPayload,
  isFullMakeModelSelection,
  normalizeSelectedItemsForMake,
} from "./utils/make-model-selection";

export const MakeSelectorItem = ({
  isLoading,
  models,
  item,
  selectedMakes,
  setSelectedMakes,
  selectedItems: controlledSelectedItems,
  setSelectedItems: controlledSetSelectedItems,
  onApplyMakeModelPayload,
}: MakeSelectorItemProps) => {
  const store = useSelectedItemsStore();
  const selectedItems = controlledSelectedItems ?? store.selectedItems;
  const setSelectedItems = controlledSetSelectedItems ?? store.setSelectedItems;
  const { handleMultiKeysChange } = useFiltersManager({
    keys: [MAKE_KEY, MODEL_KEY],
  });
  const modelsByMake = models.filter((model) => model.make_id === item.id);

  const selected_model_slugs_for_make = selectedItems
    .filter(
      (selectedItem) =>
        selectedItem.type === "model" && selectedItem.make_id === item.id,
    )
    .map((selectedItem) => selectedItem.slug);

  const is_make_all_selected =
    selectedItems.some(
      (selectedItem) =>
        selectedItem.type === "make" && selectedItem.make_id === item.id,
    ) || isFullMakeModelSelection(selected_model_slugs_for_make, modelsByMake);

  const applySelectionAndUrl = (next_items: SelectedItem[]) => {
    const normalized = normalizeSelectedItemsForMake(
      next_items,
      item,
      modelsByMake,
    );

    setSelectedItems(normalized);

    const payload = buildMakeModelUrlPayload(normalized);

    if (onApplyMakeModelPayload) {
      onApplyMakeModelPayload(payload);
      return;
    }

    handleMultiKeysChange({
      [MAKE_KEY]: payload[MAKE_KEY],
      [MODEL_KEY]: payload[MODEL_KEY],
    });
  };

  const handleExpandMake = () => {
    if (selectedMakes.find((make) => make.slug === item.slug)) {
      setSelectedMakes(selectedMakes.filter((make) => make.slug !== item.slug));
    } else {
      setSelectedMakes([...selectedMakes, item]);
    }
  };

  const handleSelectMake = (checked: boolean) => {
    if (checked) {
      const next_items: SelectedItem[] = [
        ...selectedItems.filter(
          (selectedItem) =>
            !(
              selectedItem.type === "make" && selectedItem.make_id === item.id
            ) &&
            !(
              selectedItem.type === "model" && selectedItem.make_id === item.id
            ),
        ),
        {
          value: true,
          type: "make",
          slug: item.slug,
          make_id: item.id,
        },
      ];

      applySelectionAndUrl(next_items);
    } else {
      const next_items = selectedItems.filter(
        (selectedItem) =>
          !(selectedItem.type === "make" && selectedItem.make_id === item.id) &&
          !(selectedItem.type === "model" && selectedItem.make_id === item.id),
      );

      applySelectionAndUrl(next_items);
    }
  };

  const handleSelectModel = (checked: boolean, model: HeroCatalogFacetItem) => {
    const next_items = checked
      ? [
          ...selectedItems.filter(
            (selectedItem) =>
              !(
                selectedItem.type === "model" &&
                selectedItem.slug === model.slug
              ) &&
              !(
                selectedItem.type === "make" &&
                selectedItem.make_id === model.make_id
              ),
          ),
          {
            value: true,
            type: "model" as const,
            slug: model.slug,
            make_id: model.make_id,
          },
        ]
      : selectedItems.filter(
          (selectedItem) =>
            !(
              selectedItem.type === "model" && selectedItem.slug === model.slug
            ),
        );

    applySelectionAndUrl(next_items);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={handleExpandMake}
        className="flex items-center gap-2 p-2 justify-between hover:bg-muted rounded-md cursor-pointer"
      >
        {item.name}

        <div className="flex items-center gap-2">
          <span>{item.vehicle_count}</span>

          {selectedMakes.find((make) => make.slug === item.slug) ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </div>
      </div>

      {selectedMakes.find((make) => make.slug === item.slug) && (
        <div className="flex flex-col gap-2 bg-muted rounded-md p-2">
          {isLoading ? (
            <MakeSelectorItemSkeleton />
          ) : (
            <>
              <CustomCheckbox
                checked={is_make_all_selected}
                onChange={(e) => handleSelectMake(e.target.checked)}
                label="Todos"
              />

              <Separator />

              {modelsByMake.map((model) => {
                const isModelSelected = selectedItems.some(
                  (selectedItem) =>
                    selectedItem.type === "model" &&
                    selectedItem.slug === model.slug,
                );

                return (
                  <CustomCheckbox
                    key={model.id}
                    checked={is_make_all_selected || isModelSelected}
                    disabled={is_make_all_selected}
                    onChange={(e) => handleSelectModel(e.target.checked, model)}
                    label={
                      <div className="flex items-center justify-between w-full">
                        <p>{model.name}</p>

                        <span className="text-xs text-muted-foreground">
                          {model.vehicle_count}
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
