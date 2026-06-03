import qs, { type IParseOptions, type IStringifyOptions } from "qs";

/** Parseo alineado con `build-listing-url` (arrays en coma) y URLs repetidas (`marcas=a&marcas=b`). */
export const FILTERS_QS_PARSE_OPTIONS: IParseOptions = {
  ignoreQueryPrefix: true,
  comma: true,
  arrayLimit: 100,
  allowDots: false,
};

/** Serialización por defecto: arrays como `key=a,b` (compatible con el listado actual). */
export const FILTERS_QS_STRINGIFY_OPTIONS: IStringifyOptions = {
  skipNulls: true,
  arrayFormat: "comma",
  encode: true,
};

/** Repite la clave por cada ítem: `marcas=audi&marcas=bmw`. */
export const FILTERS_QS_STRINGIFY_REPEAT_OPTIONS: IStringifyOptions = {
  skipNulls: true,
  arrayFormat: "repeat",
  encode: true,
};

export type FilterQueryValue =
  | string
  | string[]
  | number
  | boolean
  | undefined;

export type FiltersQueryRecord = Record<string, FilterQueryValue>;

export const normalizeFilterQueryValue = (
  value: unknown,
): string | string[] | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const items = value
      .flatMap((entry) => {
        if (entry === undefined || entry === null) {
          return [];
        }
        return String(entry)
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part.length > 0);
      })
      .filter((part) => part.length > 0);

    return items.length > 0 ? items : undefined;
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.includes(",")) {
    const items = trimmed
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    return items.length > 0 ? items : undefined;
  }

  return trimmed;
};

export const toStringArray = (
  value: string | string[] | undefined,
): string[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

export const parseFiltersQueryString = (
  query_string: string,
): FiltersQueryRecord => {
  const parsed = qs.parse(query_string, FILTERS_QS_PARSE_OPTIONS);
  const record: FiltersQueryRecord = {};

  Object.entries(parsed).forEach(([key, raw]) => {
    const normalized = normalizeFilterQueryValue(raw);
    if (normalized !== undefined) {
      record[key] = normalized;
    }
  });

  return record;
};

export const stringifyFiltersQuery = (
  record: FiltersQueryRecord,
  options: IStringifyOptions = FILTERS_QS_STRINGIFY_OPTIONS,
): string => {
  const cleaned: Record<string, string | string[] | number | boolean> = {};

  Object.entries(record).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }
    if (Array.isArray(value) && value.length === 0) {
      return;
    }
    cleaned[key] = value;
  });

  return qs.stringify(cleaned, options);
};

export const setFilterQueryValue = (
  record: FiltersQueryRecord,
  key: string,
  value?: FilterQueryValue,
): void => {
  if (
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    delete record[key];
    return;
  }

  record[key] = value;
};

export const toggleFilterQueryArrayItem = (
  record: FiltersQueryRecord,
  key: string,
  item: string,
  checked: boolean,
): void => {
  const current = toStringArray(
    normalizeFilterQueryValue(record[key]) as string | string[] | undefined,
  );

  const next = checked
    ? current.includes(item)
      ? current
      : [...current, item]
    : current.filter((slug) => slug !== item);

  setFilterQueryValue(record, key, next.length > 0 ? next : undefined);
};
