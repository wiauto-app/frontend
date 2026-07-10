import type { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import {
  formatPrice,
  getConditionLabel,
} from "@/app/(public)/vehiculos/utils";

export type ActiveFilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type SlugFilterKey = Extract<
  keyof FindAllVehiclesParams,
  | "makes_slugs"
  | "models_slugs"
  | "categories_slugs"
  | "provinces_slugs"
  | "comunities_slugs"
  | "municipalities_slugs"
  | "service_slugs"
  | "warranty_slugs"
  | "color_slugs"
  | "features_slugs"
  | "fuel_type_slugs"
  | "traction_slugs"
  | "cuota_slugs"
>;

type ChipHandlers = {
  filters: FindAllVehiclesParams;
  commitFilters: (next_filters: FindAllVehiclesParams) => void;
  handleBrandToggle: (slug: string) => void;
  setSearchInput: (value: string) => void;
};

const remove_slug_from_filter = (
  key: SlugFilterKey,
  slug: string,
  handlers: ChipHandlers,
) => {
  const current = (handlers.filters[key] as string[] | undefined) ?? [];
  const next = current.filter((item) => item !== slug);
  handlers.commitFilters({
    ...handlers.filters,
    [key]: next.length > 0 ? next : undefined,
    page: 1,
  });
};

const publisher_labels: Record<string, string> = {
  professional: "Profesional",
  particular: "Particular",
};

const transmission_labels: Record<string, string> = {
  manual: "Manual",
  automatic: "Automático",
};

const build_applied_chips = (
  active_filters: ActiveFiltersResponse,
  handlers: ChipHandlers,
): ActiveFilterChip[] => {
  const chips: ActiveFilterChip[] = [];
  const { applied } = active_filters;
  const { filters, commitFilters } = handlers;

  if (applied.since_price != null || applied.until_price != null) {
    const parts: string[] = [];
    if (applied.since_price != null) {
      parts.push(`desde ${formatPrice(applied.since_price)}`);
    }
    if (applied.until_price != null) {
      parts.push(`hasta ${formatPrice(applied.until_price)}`);
    }
    chips.push({
      key: "price-range",
      label: `Precio: ${parts.join(" ")}`,
      onRemove: () => {
        commitFilters({
          ...filters,
          since_price: undefined,
          until_price: undefined,
          page: 1,
        });
      },
    });
  }

  if (applied.price_offer) {
    chips.push({
      key: "price-offer",
      label: "En oferta",
      onRemove: () => {
        commitFilters({ ...filters, price_offer: undefined, page: 1 });
      },
    });
  }

  if (applied.since_year != null || applied.until_year != null) {
    const parts: string[] = [];
    if (applied.since_year != null) {
      parts.push(`desde ${applied.since_year}`);
    }
    if (applied.until_year != null) {
      parts.push(`hasta ${applied.until_year}`);
    }
    chips.push({
      key: "year-range",
      label: `Año: ${parts.join(" ")}`,
      onRemove: () => {
        commitFilters({
          ...filters,
          since_year: undefined,
          until_year: undefined,
          page: 1,
        });
      },
    });
  }

  if (applied.since_mileage != null || applied.until_mileage != null) {
    const parts: string[] = [];
    if (applied.since_mileage != null) {
      parts.push(`desde ${applied.since_mileage.toLocaleString("es-ES")} km`);
    }
    if (applied.until_mileage != null) {
      parts.push(`hasta ${applied.until_mileage.toLocaleString("es-ES")} km`);
    }
    chips.push({
      key: "mileage-range",
      label: `Kilometraje: ${parts.join(" ")}`,
      onRemove: () => {
        commitFilters({
          ...filters,
          since_mileage: undefined,
          until_mileage: undefined,
          page: 1,
        });
      },
    });
  }

  if (
    applied.power_since != null ||
    applied.power_until != null
  ) {
    const parts: string[] = [];
    if (applied.power_since != null) {
      parts.push(`desde ${applied.power_since} CV`);
    }
    if (applied.power_until != null) {
      parts.push(`hasta ${applied.power_until} CV`);
    }
    chips.push({
      key: "power-range",
      label: `Potencia: ${parts.join(" ")}`,
      onRemove: () => {
        commitFilters({
          ...filters,
          power_since: undefined,
          power_until: undefined,
          page: 1,
        });
      },
    });
  }

  if (
    applied.displacement_since != null ||
    applied.displacement_until != null
  ) {
    const parts: string[] = [];
    if (applied.displacement_since != null) {
      parts.push(`desde ${applied.displacement_since} cc`);
    }
    if (applied.displacement_until != null) {
      parts.push(`hasta ${applied.displacement_until} cc`);
    }
    chips.push({
      key: "displacement-range",
      label: `Cilindrada: ${parts.join(" ")}`,
      onRemove: () => {
        commitFilters({
          ...filters,
          displacement_since: undefined,
          displacement_until: undefined,
          page: 1,
        });
      },
    });
  }

  if (applied.lat != null && applied.lng != null && applied.radius != null) {
    const radius_km = Math.round(applied.radius / 1000);
    chips.push({
      key: "geo-radius",
      label: `Radio: ${radius_km} km`,
      onRemove: () => {
        commitFilters({
          ...filters,
          lat: undefined,
          lng: undefined,
          radius: undefined,
          page: 1,
        });
      },
    });
  }

  if (applied.is_seller_featured) {
    chips.push({
      key: "seller-featured",
      label: "Vendedor destacado",
      onRemove: () => {
        commitFilters({
          ...filters,
          is_seller_featured: undefined,
          page: 1,
        });
      },
    });
  }

  applied.publisher_types?.forEach((publisher_type) => {
    chips.push({
      key: `publisher-${publisher_type}`,
      label: publisher_labels[publisher_type] ?? publisher_type,
      onRemove: () => {
        const next = filters.publisher_types?.filter(
          (item) => item !== publisher_type,
        );
        commitFilters({
          ...filters,
          publisher_types: next?.length ? next : undefined,
          page: 1,
        });
      },
    });
  });

  applied.transmission_types?.forEach((transmission_type) => {
    chips.push({
      key: `transmission-${transmission_type}`,
      label: transmission_labels[transmission_type] ?? transmission_type,
      onRemove: () => {
        const next = filters.transmission_types?.filter(
          (item) => item !== transmission_type,
        );
        commitFilters({
          ...filters,
          transmission_types: next?.length ? next : undefined,
          page: 1,
        });
      },
    });
  });

  return chips;
};

export const hasVisibleActiveFilters = (
  active_filters: ActiveFiltersResponse | null,
  url_filters?: FindAllVehiclesParams,
): boolean => {
  if (!active_filters) return false;
  const { resolved, applied } = active_filters;
  const has_resolved =
    resolved.vehicle_type != null ||
    resolved.makes.length > 0 ||
    resolved.models.length > 0 ||
    resolved.categories.length > 0 ||
    resolved.provinces.length > 0 ||
    resolved.communities.length > 0 ||
    resolved.municipalities.length > 0 ||
    resolved.services.length > 0 ||
    resolved.warranties.length > 0 ||
    resolved.colors.length > 0 ||
    resolved.dgt_labels.length > 0 ||
    resolved.features.length > 0 ||
    resolved.fuels.length > 0 ||
    resolved.tractions.length > 0 ||
    resolved.cuotas.length > 0;
  const has_applied = Object.keys(applied).length > 0;
  const has_url =
    Boolean(url_filters?.query) || Boolean(url_filters?.condition);

  return has_resolved || has_applied || has_url;
};

export const buildActiveFilterChips = (
  active_filters: ActiveFiltersResponse | null,
  handlers: ChipHandlers,
): ActiveFilterChip[] => {
  const chips: ActiveFilterChip[] = [];
  if (!active_filters) return chips;
  const { resolved } = active_filters;
  const { filters, commitFilters, handleBrandToggle, setSearchInput } = handlers;

  if (filters.query) {
    chips.push({
      key: "query",
      label: `Búsqueda: ${filters.query}`,
      onRemove: () => {
        setSearchInput("");
        commitFilters({ ...filters, query: undefined, page: 1 });
      },
    });
  }

  if (filters.condition) {
    chips.push({
      key: "condition",
      label: getConditionLabel(filters.condition),
      onRemove: () => {
        commitFilters({ ...filters, condition: undefined, page: 1 });
      },
    });
  }

  if (resolved.vehicle_type) {
    chips.push({
      key: `type-${resolved.vehicle_type.slug}`,
      label: resolved.vehicle_type.name,
      onRemove: () => {
        commitFilters({ ...filters, type_slug: undefined, page: 1 });
      },
    });
  }

  resolved.makes.forEach((make) => {
    chips.push({
      key: `make-${make.slug}`,
      label: make.name,
      onRemove: () => handleBrandToggle(make.slug),
    });
  });

  resolved.models.forEach((model) => {
    chips.push({
      key: `model-${model.slug}`,
      label: model.name,
      onRemove: () => remove_slug_from_filter("models_slugs", model.slug, handlers),
    });
  });

  resolved.categories.forEach((category) => {
    chips.push({
      key: `category-${category.slug}`,
      label: category.name,
      onRemove: () =>
        remove_slug_from_filter("categories_slugs", category.slug, handlers),
    });
  });

  resolved.provinces.forEach((province) => {
    chips.push({
      key: `province-${province.slug}`,
      label: province.name,
      onRemove: () =>
        remove_slug_from_filter("provinces_slugs", province.slug, handlers),
    });
  });

  resolved.communities.forEach((community) => {
    chips.push({
      key: `community-${community.slug}`,
      label: community.name,
      onRemove: () =>
        remove_slug_from_filter("comunities_slugs", community.slug, handlers),
    });
  });

  resolved.municipalities.forEach((municipality) => {
    chips.push({
      key: `municipality-${municipality.slug}`,
      label: municipality.name,
      onRemove: () =>
        remove_slug_from_filter(
          "municipalities_slugs",
          municipality.slug,
          handlers,
        ),
    });
  });

  resolved.services.forEach((service) => {
    chips.push({
      key: `service-${service.slug}`,
      label: service.name,
      onRemove: () =>
        remove_slug_from_filter("service_slugs", service.slug, handlers),
    });
  });

  resolved.warranties.forEach((warranty) => {
    chips.push({
      key: `warranty-${warranty.slug}`,
      label: warranty.name,
      onRemove: () =>
        remove_slug_from_filter("warranty_slugs", warranty.slug, handlers),
    });
  });

  resolved.colors.forEach((color) => {
    chips.push({
      key: `color-${color.slug}`,
      label: color.name,
      onRemove: () => remove_slug_from_filter("color_slugs", color.slug, handlers),
    });
  });

  resolved.dgt_labels.forEach((label) => {
    chips.push({
      key: `dgt-${label.id}`,
      label: label.code ? `Etiqueta DGT ${label.code}` : label.name,
      onRemove: () => {
        const current = filters.dgt_label_ids ?? [];
        const next = current.filter((id) => String(id) !== String(label.id));
        commitFilters({
          ...filters,
          dgt_label_ids: next.length > 0 ? next : undefined,
          page: 1,
        });
      },
    });
  });

  resolved.features.forEach((feature) => {
    chips.push({
      key: `feature-${feature.slug}`,
      label: feature.name,
      onRemove: () =>
        remove_slug_from_filter("features_slugs", feature.slug, handlers),
    });
  });

  resolved.fuels.forEach((fuel) => {
    chips.push({
      key: `fuel-${fuel.slug}`,
      label: fuel.name,
      onRemove: () =>
        remove_slug_from_filter("fuel_type_slugs", fuel.slug, handlers),
    });
  });

  resolved.tractions.forEach((traction) => {
    chips.push({
      key: `traction-${traction.slug}`,
      label: traction.name,
      onRemove: () =>
        remove_slug_from_filter("traction_slugs", traction.slug, handlers),
    });
  });

  resolved.cuotas.forEach((cuota) => {
    chips.push({
      key: `cuota-${cuota.slug}`,
      label: cuota.name,
      onRemove: () => remove_slug_from_filter("cuota_slugs", cuota.slug, handlers),
    });
  });

  chips.push(...build_applied_chips(active_filters, handlers));

  return chips;
};
