"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

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
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import { buildHeroListingHref } from "@/lib/vehicles/listing-url";
import {
  buildHeroLocationTriggerLabel,
  toHeroLocationPayload,
} from "@/components/home/hero-location-selection";
import { useOptionalHeroSearchFilters } from "./HeroSearchFiltersContext";
import { WiautoImage } from "../ui/wiautoImage";

const EMPTY_PROVINCE_COMMUNITY_CODES: readonly string[] = [];

interface LocationSnapshot {
  communities: HeroCatalogFacetItem[];
  provinces: HeroCatalogFacetItem[];
}

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

interface CommunityProvincesProps {
  community: HeroCatalogFacetItem;
  search: string;
  selectedCommunities: HeroCatalogFacetItem[];
  selectedProvinces: HeroCatalogFacetItem[];
  onToggleCommunity: (community: HeroCatalogFacetItem, checked: boolean) => void;
  onToggleProvince: (province: HeroCatalogFacetItem, checked: boolean) => void;
}

const CommunityProvinces = ({
  community,
  search,
  selectedCommunities,
  selectedProvinces,
  onToggleCommunity,
  onToggleProvince,
}: CommunityProvincesProps) => {
  const cod = community.community_cod_ccaa ?? "";
  const community_name_matches_search =
    search.length > 0 &&
    community.name.toLowerCase().includes(search.toLowerCase());
  const province_search = community_name_matches_search
    ? undefined
    : search || undefined;

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: [
      "hero-catalog",
      "provinces",
      cod,
      province_search,
    ],
    queryFn: () =>
      heroCatalogService.getProvinces(
        province_search,
        cod || undefined,
        community,
      ),
    enabled: Boolean(cod),
  });

  const is_community_selected = selectedCommunities.some(
    (item) => item.id === community.id,
  );
  const selected_provinces_for_community = selectedProvinces.filter(
    (province) => province.community_cod_ccaa === cod,
  );
  const is_all_provinces_selected =
    is_community_selected && selected_provinces_for_community.length === 0;
  const selected_province_ids = new Set(
    selectedProvinces.map((province) => province.id),
  );

  const handleAllProvincesChange = (checked: boolean) => {
    if (checked) {
      selected_provinces_for_community.forEach((province) =>
        onToggleProvince(province, false),
      );
      onToggleCommunity(community, true);
      return;
    }

    onToggleCommunity(community, false);
  };

  return (
    <div className="flex flex-col gap-2 py-2 pl-8 pr-2">
      <CustomCheckbox
        checked={is_all_provinces_selected}
        onChange={(event) => handleAllProvincesChange(event.target.checked)}
        label={<p className="truncate font-medium">Todas las provincias</p>}
      />
      {isLoading && <RowSkeletons count={3} />}
      {!isLoading && provinces.length === 0 && (
        <p className="px-1 py-1 text-sm text-muted-foreground">
          No hay provincias disponibles
        </p>
      )}
      {!isLoading &&
        provinces.map((province) => (
          <CustomCheckbox
            key={province.id}
            checked={selected_province_ids.has(province.id)}
            onChange={(event) =>
              onToggleProvince(province, event.target.checked)
            }
            label={<p className="truncate">{province.name}</p>}
          />
        ))}
    </div>
  );
};

interface CommunityRowProps {
  community: HeroCatalogFacetItem;
  isOpen: boolean;
  isSelected: boolean;
  search: string;
  selectedCommunities: HeroCatalogFacetItem[];
  selectedProvinces: HeroCatalogFacetItem[];
  onToggle: (community: HeroCatalogFacetItem) => void;
  onToggleCommunity: (community: HeroCatalogFacetItem, checked: boolean) => void;
  onToggleProvince: (province: HeroCatalogFacetItem, checked: boolean) => void;
}

const CommunityRow = ({
  community,
  isOpen,
  isSelected,
  search,
  selectedCommunities,
  selectedProvinces,
  onToggle,
  onToggleCommunity,
  onToggleProvince,
}: CommunityRowProps) => (
  <div className="border-b last:border-b-0">
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => onToggle(community)}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-2 py-2 text-left text-sm transition-colors",
        isOpen ? "bg-primary/5 text-primary" : "hover:bg-muted",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {community.image_url ? (
          <WiautoImage
            src={community.image_url}
            alt=""
            width={24}
            height={24}
            sizes="12px"
            className="shrink-0 rounded-sm object-contain"
            aria-hidden
          />
        ) : null}
        <span className="truncate">{community.name}</span>
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
    {isOpen ? (
      <CommunityProvinces
        community={community}
        search={search}
        selectedCommunities={selectedCommunities}
        selectedProvinces={selectedProvinces}
        onToggleCommunity={onToggleCommunity}
        onToggleProvince={onToggleProvince}
      />
    ) : null}
  </div>
);

export interface HeroFiltersLocationSelectorProps {
  navigateOnSelect?: boolean;
  onNavigate?: (href: string) => void;
  placeholder?: string;
  onApplyLocationPayload?: (payload: LocationUrlPayload) => void;
}

export const HeroFiltersLocationSelector = ({
  navigateOnSelect = false,
  onNavigate,
  placeholder = "Ubicación",
  onApplyLocationPayload,
}: HeroFiltersLocationSelectorProps) => {
  const router = useRouter();
  const hero_context = useOptionalHeroSearchFilters();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openCommunityId, setOpenCommunityId] = useState<number | null>(null);
  const snapshotRef = useRef<LocationSnapshot | null>(null);
  const debounced_search = useDebouncedValue(search, 300);
  const trimmed_search = debounced_search.trim();

  const context_communities = hero_context?.selectedCommunities ?? [];
  const context_provinces = hero_context?.selectedProvinces ?? [];

  const [draftCommunities, setDraftCommunities] = useState(context_communities);
  const [draftProvinces, setDraftProvinces] = useState(context_provinces);

  useEffect(() => {
    if (!open) {
      setDraftCommunities(context_communities);
      setDraftProvinces(context_provinces);
    }
  }, [context_communities, context_provinces, open]);

  const { data: communities = [], isLoading: is_loading_communities } =
    useQuery({
      queryKey: ["hero-catalog", "communities", trimmed_search],
      queryFn: () => heroCatalogService.getCommunities(trimmed_search || undefined),
    });

  const { data: province_match_community_codes } = useQuery({
    queryKey: ["hero-catalog", "province-community-codes", trimmed_search],
    queryFn: () =>
      heroCatalogService.searchProvinceCommunityCodes(trimmed_search),
    enabled: trimmed_search.length > 0,
  });

  useEffect(() => {
    if (!trimmed_search) {
      return;
    }

    if (communities.length === 0) {
      setOpenCommunityId(null);
      return;
    }

    const matched_codes = new Set(
      province_match_community_codes ?? EMPTY_PROVINCE_COMMUNITY_CODES,
    );
    const first_match =
      communities.find((community) =>
        matched_codes.has(community.community_cod_ccaa ?? ""),
      ) ?? communities[0];
    setOpenCommunityId(first_match.id);
  }, [communities, province_match_community_codes, trimmed_search]);

  useEffect(() => {
    if (!trimmed_search) {
      setOpenCommunityId(null);
    }
  }, [trimmed_search]);

  const selected_community_ids = useMemo(
    () => new Set(draftCommunities.map((community) => community.id)),
    [draftCommunities],
  );

  const trigger_label = useMemo(
    () =>
      buildHeroLocationTriggerLabel(
        draftCommunities,
        draftProvinces,
        placeholder,
      ),
    [draftCommunities, draftProvinces, placeholder],
  );

  const handleToggleCommunity = (
    community: HeroCatalogFacetItem,
    checked: boolean,
  ) => {
    const cod = community.community_cod_ccaa;
    if (checked) {
      setDraftCommunities((prev) => {
        if (prev.some((item) => item.id === community.id)) {
          return prev;
        }
        return [...prev, community];
      });
      return;
    }

    setDraftCommunities((prev) =>
      prev.filter((item) => item.id !== community.id),
    );
    if (cod) {
      setDraftProvinces((prev) =>
        prev.filter((province) => province.community_cod_ccaa !== cod),
      );
    }
  };

  const handleToggleProvince = (
    province: HeroCatalogFacetItem,
    checked: boolean,
  ) => {
    if (!checked) {
      setDraftProvinces((prev) =>
        prev.filter((item) => item.id !== province.id),
      );
      return;
    }

    setDraftProvinces((prev) => {
      if (prev.some((item) => item.id === province.id)) {
        return prev;
      }
      return [...prev, province];
    });

    const community_id = province.community_id;
    const cod = province.community_cod_ccaa;
    const slug = province.community_slug;
    const name = province.community_name;
    if (!community_id || !cod || !slug || !name) {
      return;
    }

    setDraftCommunities((prev) => {
      if (prev.some((item) => item.id === community_id)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: community_id,
          slug,
          name,
          vehicle_count: 0,
          community_cod_ccaa: cod,
        },
      ];
    });
  };

  const handleToggleRow = (community: HeroCatalogFacetItem) => {
    setOpenCommunityId((current) =>
      current === community.id ? null : community.id,
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      snapshotRef.current = {
        communities: [...draftCommunities],
        provinces: [...draftProvinces],
      };
    }
    setOpen(nextOpen);
  };

  const handleCancel = () => {
    const snapshot = snapshotRef.current;
    if (snapshot) {
      setDraftCommunities(snapshot.communities);
      setDraftProvinces(snapshot.provinces);
    }
    setOpen(false);
    setSearch("");
  };

  const commitSelection = (
    communities: HeroCatalogFacetItem[],
    provinces: HeroCatalogFacetItem[],
  ) => {
    const payload = toHeroLocationPayload(communities, provinces);

    if (navigateOnSelect) {
      const href = buildHeroListingHref(payload);
      if (onNavigate) {
        onNavigate(href);
      } else {
        router.push(href);
      }
      return;
    }

    if (onApplyLocationPayload) {
      onApplyLocationPayload(payload);
      hero_context?.replaceLocationSelection(communities, provinces);
      return;
    }

    hero_context?.replaceLocationSelection(communities, provinces);
  };

  const handleApply = () => {
    commitSelection(draftCommunities, draftProvinces);
    setOpen(false);
    setSearch("");
  };

  const is_community_marked = (community: HeroCatalogFacetItem): boolean => {
    const cod = community.community_cod_ccaa;
    const has_community = selected_community_ids.has(community.id);
    const has_provinces =
      cod &&
      draftProvinces.some((province) => province.community_cod_ccaa === cod);
    return has_community || Boolean(has_provinces);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start text-base"
            aria-label="Seleccionar ubicación"
          >
            <div className="flex w-full items-center justify-between text-sm">
              <span className="truncate">{trigger_label}</span>
              <ChevronDown className="size-4 shrink-0 opacity-50" />
            </div>
          </Button>
        }
      />
      <PopoverContent
        align="start"
        side="bottom"
        className="flex w-full flex-col gap-2 md:w-72"
      >
        <SearchInput
          placeholder="Buscar comunidad o provincia"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          aria-label="Buscar comunidad o provincia"
        />

        <div className="max-h-44 overflow-y-auto" role="list">
          {is_loading_communities && <RowSkeletons count={5} />}
          {!is_loading_communities && communities.length === 0 && (
            <p className="px-2 py-2 text-sm text-muted-foreground">
              No hay comunidades disponibles
            </p>
          )}
          {!is_loading_communities &&
            communities.map((community) => (
              <CommunityRow
                key={community.id}
                community={community}
                isOpen={openCommunityId === community.id}
                isSelected={is_community_marked(community)}
                search={trimmed_search}
                selectedCommunities={draftCommunities}
                selectedProvinces={draftProvinces}
                onToggle={handleToggleRow}
                onToggleCommunity={handleToggleCommunity}
                onToggleProvince={handleToggleProvince}
              />
            ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleCancel} variant="outline" size="sm">
            Cancelar
          </Button>
          <Button onClick={handleApply} variant="default" size="sm">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
