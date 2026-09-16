"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { heroCatalogService } from "@/services/search/heroCatalogService";
import { useHeroSearchFilters } from "./HeroSearchFiltersContext";
import { WiautoImage } from "../ui/wiautoImage";

const EMPTY_MODEL_MAKE_IDS: readonly number[] = [];

const buildMakeTriggerLabel = (
  selectedMakes: HeroCatalogFacetItem[],
  selectedModels: HeroCatalogFacetItem[],
): string => {
  if (selectedModels.length > 0) {
    return selectedModels.map((model) => model.name).join(", ");
  }

  if (selectedMakes.length > 0) {
    return selectedMakes.map((make) => make.name).join(", ");
  }

  return "Marca / modelo";
};

const RowSkeletons = ({ count }: { count: number }) => (
  <div className="flex flex-col gap-2 p-1">
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        className="h-8 w-full rounded-sm bg-muted-foreground/20"
      />
    ))}
  </div>
);

interface MakeModelsProps {
  make: HeroCatalogFacetItem;
  search: string;
}

const MakeModels = ({ make, search }: MakeModelsProps) => {
  const { selectedMakes, selectedModels, handleToggleMake, handleToggleModel } =
    useHeroSearchFilters();

  // Si el texto ya matcheó por nombre de marca, no lo usamos para filtrar modelos:
  // ningún modelo se llama "toyota", así que hay que listarlos todos.
  const make_name_matches_search =
    search.length > 0 && make.name.toLowerCase().includes(search.toLowerCase());
  const model_search = make_name_matches_search ? undefined : search || undefined;

  const { data: models = [], isLoading } = useQuery({
    queryKey: ["hero-catalog", "models", make.id, model_search],
    queryFn: () =>
      heroCatalogService.getModels(make.id, model_search, {
        id: make.id,
        slug: make.slug,
        name: make.name,
      }),
  });

  const is_make_selected = selectedMakes.some(
    (selected) => selected.id === make.id,
  );
  const selected_models_for_make = selectedModels.filter(
    (model) => model.make_id === make.id || model.make_slug === make.slug,
  );
  const is_all_models_selected =
    is_make_selected && selected_models_for_make.length === 0;
  const selected_model_ids = new Set(
    selectedModels.map((model) => model.id),
  );

  const handleAllModelsChange = (checked: boolean) => {
    if (checked) {
      selected_models_for_make.forEach((model) =>
        handleToggleModel(model, false),
      );
      handleToggleMake(make, true);
      return;
    }

    handleToggleMake(make, false);
  };

  return (
    <div className="flex flex-col gap-2 py-2 pl-8 pr-2">
      <CustomCheckbox
        checked={is_all_models_selected}
        onChange={(event) => handleAllModelsChange(event.target.checked)}
        label={<p className="truncate font-medium">Todos los modelos</p>}
      />
      {isLoading && <RowSkeletons count={3} />}
      {!isLoading && models.length === 0 && (
        <p className="px-1 py-1 text-sm text-muted-foreground">
          No hay modelos disponibles
        </p>
      )}
      {!isLoading &&
        models.map((model) => (
          <CustomCheckbox
            key={model.id}
            checked={selected_model_ids.has(model.id)}
            onChange={(event) =>
              handleToggleModel(model, event.target.checked)
            }
            label={<p className="truncate">{model.name}</p>}
          />
        ))}
    </div>
  );
};

interface MakeRowProps {
  make: HeroCatalogFacetItem;
  isOpen: boolean;
  isSelected: boolean;
  search: string;
  onToggle: (make: HeroCatalogFacetItem) => void;
}

const MakeRow = ({ make, isOpen, isSelected, search, onToggle }: MakeRowProps) => (
  <div className="border-b last:border-b-0">
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => onToggle(make)}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-2 py-2 text-left text-sm transition-colors",
        isOpen ? "bg-primary/5 text-primary" : "hover:bg-muted",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {make.image_url ? (
          <WiautoImage
            src={make.image_url}
            alt=""
            width={24}
            height={24}
            sizes="12px"
            className="shrink-0 rounded-sm object-contain"
            aria-hidden
          />
        ) : null}
        <span className="truncate">{make.name}</span>
        {isSelected ? (
          <span
            className="size-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden
          />
        ) : null}
      </span>
      <ChevronDown
        className={cn(
          "size-4 shrink-0 transition-transform",
          isOpen ? "rotate-180 opacity-70" : "opacity-40",
        )}
        aria-hidden
      />
    </button>
    {isOpen ? <MakeModels make={make} search={search} /> : null}
  </div>
);

export const HeroFiltersMakeSelector = () => {
  const { selectedMakes, selectedModels } = useHeroSearchFilters();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openMakeId, setOpenMakeId] = useState<number | null>(null);
  const debounced_search = useDebouncedValue(search, 300);
  const trimmed_search = debounced_search.trim();

  const { data: makes = [], isLoading: is_loading_makes } = useQuery({
    queryKey: ["hero-catalog", "makes", trimmed_search],
    queryFn: () => heroCatalogService.getMakes(trimmed_search || undefined),
  });

  const { data: model_match_make_ids } = useQuery({
    queryKey: ["hero-catalog", "model-make-ids", trimmed_search],
    queryFn: () => heroCatalogService.searchModelMakeIds(trimmed_search),
    enabled: trimmed_search.length > 0,
  });

  // Mientras hay búsqueda, la marca abierta sigue al resultado (nombre o modelo matcheado).
  useEffect(() => {
    if (!trimmed_search) {
      return;
    }

    if (makes.length === 0) {
      setOpenMakeId(null);
      return;
    }

    const matched_ids = new Set(model_match_make_ids ?? EMPTY_MODEL_MAKE_IDS);
    const first_match =
      makes.find((make) => matched_ids.has(make.id)) ?? makes[0];
    setOpenMakeId(first_match.id);
  }, [makes, model_match_make_ids, trimmed_search]);

  // Al borrar la búsqueda, no dejamos una marca abierta que ya no viene al caso.
  useEffect(() => {
    if (!trimmed_search) {
      setOpenMakeId(null);
    }
  }, [trimmed_search]);

  const selected_make_ids = useMemo(
    () => new Set(selectedMakes.map((make) => make.id)),
    [selectedMakes],
  );

  const trigger_label = useMemo(
    () => buildMakeTriggerLabel(selectedMakes, selectedModels),
    [selectedMakes, selectedModels],
  );

  const handleToggleRow = (make: HeroCatalogFacetItem) => {
    setOpenMakeId((current) => (current === make.id ? null : make.id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start text-base"
            aria-label="Seleccionar marca y modelo"
          >
            <div className="flex w-full items-center justify-between text-sm">
              <span className="truncate">{trigger_label}</span>
              <ChevronDown className="size-4 shrink-0 opacity-50" />
            </div>
          </Button>
        }
      />
      <PopoverContent
        align="end"
        side="bottom"
        className="flex w-full flex-col gap-2 md:w-96"
      >
        <SearchInput
          placeholder="Buscar marca o modelo"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          aria-label="Buscar marca o modelo"
        />

        <div className="max-h-44 overflow-y-auto " role="list">
          {is_loading_makes && <RowSkeletons count={5} />}
          {!is_loading_makes && makes.length === 0 && (
            <p className="px-2 py-2 text-sm text-muted-foreground">
              No hay marcas disponibles
            </p>
          )}
          {!is_loading_makes &&
            makes.map((make) => (
              <MakeRow
                key={make.id}
                make={make}
                isOpen={openMakeId === make.id}
                isSelected={selected_make_ids.has(make.id)}
                search={trimmed_search}
                onToggle={handleToggleRow}
              />
            ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => setOpen(false)} variant="outline" size="sm">
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)} variant="default" size="sm">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
