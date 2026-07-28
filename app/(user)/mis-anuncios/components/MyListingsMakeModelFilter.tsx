"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { useMakeSelectorData } from "@/components/selectors/FilterMakeSelector/hooks/useMakeSelectorData";

const ALL_VALUE = "all";

interface MyListingsMakeModelFilterProps {
  onMakeChange: (makeId: number | null) => void;
  onModelChange: (modelId: number | null) => void;
}

export const MyListingsMakeModelFilter = ({
  onMakeChange,
  onModelChange,
}: MyListingsMakeModelFilterProps) => {
  const [selectedMake, setSelectedMake] = useState<HeroCatalogFacetItem | null>(null);
  const [selectedModel, setSelectedModel] = useState<HeroCatalogFacetItem | null>(null);

  const selectedMakes = useMemo(
    () => (selectedMake ? [selectedMake] : []),
    [selectedMake],
  );
  const { makes, models, isLoadingModels } = useMakeSelectorData(selectedMakes);

  const handleMakeChange = (value: string | null) => {
    setSelectedModel(null);
    onModelChange(null);

    if (!value || value === ALL_VALUE) {
      setSelectedMake(null);
      onMakeChange(null);
      return;
    }

    const make = makes.find((item) => String(item.id) === value) ?? null;
    setSelectedMake(make);
    onMakeChange(make?.id ?? null);
  };

  const handleModelChange = (value: string | null) => {
    if (!value || value === ALL_VALUE) {
      setSelectedModel(null);
      onModelChange(null);
      return;
    }

    const model = models.find((item) => String(item.id) === value) ?? null;
    setSelectedModel(model);
    onModelChange(model?.id ?? null);
  };

  return (
    <>
      <Select
        value={selectedMake ? String(selectedMake.id) : ALL_VALUE}
        onValueChange={handleMakeChange}
        items={makes.map((make) => ({
          label: make.name,
          value: String(make.id),
        }))}
      >
        <SelectTrigger
          className="w-full sm:w-40 border-gray-200 bg-white"
          aria-label="Filtrar por marca"
        >
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todas las marcas</SelectItem>
          {makes.map((make) => (
            <SelectItem key={make.id} value={String(make.id)}>
              {make.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedModel ? String(selectedModel.id) : ALL_VALUE}
        onValueChange={handleModelChange}
        disabled={!selectedMake || isLoadingModels}
        items={models.map((model) => ({
          label: model.name,
          value: String(model.id),
        }))}
      >
        <SelectTrigger
          className="w-full sm:w-40 border-gray-200 bg-white"
          aria-label="Filtrar por modelo"
        >
          <SelectValue placeholder="Modelo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todos los modelos</SelectItem>
          {models.map((model) => (
            <SelectItem key={model.id} value={String(model.id)}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
