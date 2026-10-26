import {
  CONDITION_VEHICLE,
  PUBLISHER_TYPE,
  TRANSMISSION_TYPE,
  type FindAllVehiclesParams,
} from "@/interfaces/vehicle.interface";

export type PathFilterKind = "single" | "multi" | "range" | "number" | "flag";

export interface PathFilterRangeKeys {
  since: keyof FindAllVehiclesParams;
  until: keyof FindAllVehiclesParams;
}

export interface PathFilterDefinition {
  prefix: string;
  kind: PathFilterKind;
  dtoKey?: keyof FindAllVehiclesParams;
  rangeKeys?: PathFilterRangeKeys;
  isIndexable: boolean;
  slugToValue?: Record<string, string>;
  when?: (params: FindAllVehiclesParams) => boolean;
}

const invertSlugMap = (map: Record<string, string>): Record<string, string> =>
  Object.fromEntries(Object.entries(map).map(([slug, value]) => [value, slug]));

const CONDITION_SLUG_TO_VALUE: Record<string, string> = {
  nuevo: CONDITION_VEHICLE.NEW,
  usado: CONDITION_VEHICLE.USED,
};

const TRANSMISSION_SLUG_TO_VALUE: Record<string, string> = {
  manual: TRANSMISSION_TYPE.MANUAL,
  automatico: TRANSMISSION_TYPE.AUTOMATIC,
};

const PUBLISHER_SLUG_TO_VALUE: Record<string, string> = {
  profesional: PUBLISHER_TYPE.DEALERSHIP,
  particular: PUBLISHER_TYPE.PARTICULAR,
};

/** Orden canónico de segmentos en el path (29 entradas). */
export const LISTING_PATH_FILTERS: PathFilterDefinition[] = [
  {
    prefix: "tipo-",
    kind: "single",
    dtoKey: "type_slug",
    isIndexable: true,
  },
  {
    prefix: "estado-",
    kind: "single",
    dtoKey: "condition",
    isIndexable: true,
    slugToValue: CONDITION_SLUG_TO_VALUE,
  },
  {
    prefix: "carroceria-",
    kind: "multi",
    dtoKey: "categories_slugs",
    isIndexable: false,
  },
  {
    prefix: "marca-",
    kind: "multi",
    dtoKey: "makes_slugs",
    isIndexable: true,
  },
  {
    prefix: "modelo-",
    kind: "multi",
    dtoKey: "models_slugs",
    isIndexable: true,
  },
  {
    prefix: "comunidad-",
    kind: "multi",
    dtoKey: "comunities_slugs",
    isIndexable: true,
  },
  {
    prefix: "provincia-",
    kind: "multi",
    dtoKey: "provinces_slugs",
    isIndexable: true,
  },
  {
    prefix: "municipio-",
    kind: "multi",
    dtoKey: "municipalities_slugs",
    isIndexable: false,
  },
  {
    prefix: "combustible-",
    kind: "multi",
    dtoKey: "fuel_type_slugs",
    isIndexable: true,
  },
  {
    prefix: "cambio-",
    kind: "multi",
    dtoKey: "transmission_types",
    isIndexable: false,
    slugToValue: TRANSMISSION_SLUG_TO_VALUE,
  },
  {
    prefix: "traccion-",
    kind: "multi",
    dtoKey: "traction_slugs",
    isIndexable: false,
  },
  {
    prefix: "etiqueta-",
    kind: "multi",
    dtoKey: "dgt_label_slugs",
    isIndexable: false,
  },
  {
    prefix: "color-",
    kind: "multi",
    dtoKey: "color_slugs",
    isIndexable: false,
  },
  {
    prefix: "equipamiento-",
    kind: "multi",
    dtoKey: "features_slugs",
    isIndexable: false,
  },
  {
    prefix: "vendedor-",
    kind: "multi",
    dtoKey: "publisher_types",
    isIndexable: false,
    slugToValue: PUBLISHER_SLUG_TO_VALUE,
  },
  {
    prefix: "garantia-",
    kind: "multi",
    dtoKey: "warranty_slugs",
    isIndexable: false,
  },
  {
    prefix: "servicios-",
    kind: "multi",
    dtoKey: "service_slugs",
    isIndexable: false,
  },
  {
    prefix: "precio-",
    kind: "range",
    rangeKeys: { since: "since_price", until: "until_price" },
    isIndexable: false,
    when: (params) => !(params.cuota_slugs?.length),
  },
  {
    prefix: "cuota-",
    kind: "range",
    rangeKeys: { since: "since_price", until: "until_price" },
    isIndexable: false,
    when: (params) => (params.cuota_slugs?.length ?? 0) > 0,
  },
  {
    prefix: "plazo-",
    kind: "multi",
    dtoKey: "cuota_slugs",
    isIndexable: false,
  },
  {
    prefix: "anio-",
    kind: "range",
    rangeKeys: { since: "since_year", until: "until_year" },
    isIndexable: false,
  },
  {
    prefix: "km-",
    kind: "range",
    rangeKeys: { since: "since_mileage", until: "until_mileage" },
    isIndexable: false,
  },
  {
    prefix: "potencia-",
    kind: "range",
    rangeKeys: { since: "power_since", until: "power_until" },
    isIndexable: false,
  },
  {
    prefix: "cilindrada-",
    kind: "range",
    rangeKeys: { since: "displacement_since", until: "displacement_until" },
    isIndexable: false,
  },
  {
    prefix: "autonomia-desde-",
    kind: "number",
    dtoKey: "autonomy_since",
    isIndexable: false,
  },
  {
    prefix: "bateria-",
    kind: "range",
    rangeKeys: {
      since: "battery_capacity_since",
      until: "battery_capacity_until",
    },
    isIndexable: false,
  },
  {
    prefix: "carga-hasta-",
    kind: "number",
    dtoKey: "time_to_charge",
    isIndexable: false,
  },
  {
    prefix: "con-oferta",
    kind: "flag",
    dtoKey: "price_offer",
    isIndexable: false,
  },
  {
    prefix: "destacados",
    kind: "flag",
    dtoKey: "is_seller_featured",
    isIndexable: false,
  },
];

const SORTED_PREFIX_DEFINITIONS = [...LISTING_PATH_FILTERS].sort(
  (a, b) => b.prefix.length - a.prefix.length,
);

export const findPathFilterDefinition = (
  segment: string,
): PathFilterDefinition | undefined => {
  const decoded = decodeURIComponent(segment);

  for (const definition of SORTED_PREFIX_DEFINITIONS) {
    if (definition.kind === "flag") {
      if (decoded === definition.prefix) {
        return definition;
      }
      continue;
    }

    if (decoded.startsWith(definition.prefix)) {
      return definition;
    }
  }

  return undefined;
};

export const mapSlugToFilterValue = (
  definition: PathFilterDefinition,
  slug: string,
): string => definition.slugToValue?.[slug] ?? slug;

export const mapFilterValueToSlug = (
  definition: PathFilterDefinition,
  value: string,
): string => {
  if (!definition.slugToValue) {
    return value;
  }

  const inverted = invertSlugMap(definition.slugToValue);
  return inverted[value] ?? value;
};

export const getPathFilterDtoKeys = (): Set<keyof FindAllVehiclesParams> => {
  const keys = new Set<keyof FindAllVehiclesParams>();

  for (const definition of LISTING_PATH_FILTERS) {
    if (definition.dtoKey) {
      keys.add(definition.dtoKey);
    }
    if (definition.rangeKeys) {
      keys.add(definition.rangeKeys.since);
      keys.add(definition.rangeKeys.until);
    }
  }

  return keys;
};
