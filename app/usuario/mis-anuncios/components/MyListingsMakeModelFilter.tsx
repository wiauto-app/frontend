"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMakeSelectorData } from "@/components/selectors/FilterMakeSelector/hooks/useMakeSelectorData";

interface MyListingsMakeModelFilterProps {
  makeId: number | null;
  modelId: number | null;
  onMakeChange: (makeId: number | null) => void;
  onModelChange: (modelId: number | null) => void;
}

export const MyListingsMakeModelFilter = ({
  makeId,
  modelId,
  onMakeChange,
  onModelChange,
}: MyListingsMakeModelFilterProps) => {
  const { makes } = useMakeSelectorData([]);

  const selectedMake = useMemo(
    () => makes.find((item) => item.id === makeId) ?? null,
    [makes, makeId],
  );

  const selectedMakes = useMemo(
    () => (selectedMake ? [selectedMake] : []),
    [selectedMake],
  );

  const { models, isLoadingModels } = useMakeSelectorData(selectedMakes);

  const handleMakeChange = (value: string | null) => {
    if (!value) {
      onMakeChange(null);
      return;
    }
    const parsed = Number(value);
    onMakeChange(Number.isFinite(parsed) ? parsed : null);
  };

  const handleModelChange = (value: string | null) => {
    if (!value) {
      onModelChange(null);
      return;
    }
    const parsed = Number(value);
    onModelChange(Number.isFinite(parsed) ? parsed : null);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Select
          value={makeId != null ? String(makeId) : null}
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
            {makes.map((make) => (
              <SelectItem key={make.id} value={String(make.id)}>
                {make.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {makeId != null ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Quitar filtro de marca"
            onClick={() => onMakeChange(null)}
          >
            <X className="size-4" aria-hidden />
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <Select
          value={modelId != null ? String(modelId) : null}
          onValueChange={handleModelChange}
          disabled={makeId == null || isLoadingModels}
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
            {models.map((model) => (
              <SelectItem key={model.id} value={String(model.id)}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {modelId != null ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Quitar filtro de modelo"
            onClick={() => onModelChange(null)}
          >
            <X className="size-4" aria-hidden />
          </Button>
        ) : null}
      </div>
    </>
  );
};
