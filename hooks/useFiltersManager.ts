"use client";

import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ORDER_KEYS,
  PAGE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import { orderDirectionToUrlSegment } from "@/lib/vehicles/listing-url/order-direction";

export type FiltersDateRangeValue = {
  from: Date | undefined;
  to: Date | undefined;
};

export type FiltersNumericRangeValue = {
  since?: string;
  until?: string;
};

type UseFiltersManagerProps = {
  /** Claves de query que se leen y escriben en la URL. */
  keys: string[];
  pageKey?: string;
  /** Al cambiar un filtro, resetea la paginación (p. ej. `pagina=1`). */
  resetPageOnFilterChange?: boolean;
  historyMode?: "replace" | "push";
};

type UseFiltersManagerReturn = {
  values: Record<string, string | undefined>;
  handleChange: (key: string, value?: string) => void;
  handleRemove: (key: string) => void;
  /** Varias claves en una sola navegación (evita estados intermedios en la URL). */
  handleBatchChange: (updates: Record<string, string | undefined>) => void;
  /** Aplica orden con query amigable `orden=columna-asc|desc`. */
  handleSort: (column: string, direction: "ASC" | "DESC") => void;
  /**
   * Actualiza dos query params de fechas en un solo paso (`yyyy-MM-dd` en zona local).
   * Si `from` o `to` vienen vacíos, borra la clave correspondiente.
   */
  handleDateRangeChange: (
    fromKey: string,
    toKey: string,
    range: FiltersDateRangeValue,
  ) => void;
  /** Rango numérico en query (año, km, precio, etc.) sin usar Date. */
  handleNumericRangeChange: (
    sinceKey: string,
    untilKey: string,
    range: FiltersNumericRangeValue,
  ) => void;
};

const setOrDeleteParam = (
  params: URLSearchParams,
  key: string,
  value?: string,
) => {
  if (value === undefined || value === "") {
    params.delete(key);
    return;
  }
  params.set(key, value);
};

export const useFiltersManager = ({
  keys,
  pageKey = PAGE_KEY,
  resetPageOnFilterChange = true,
  historyMode = "replace",
}: UseFiltersManagerProps): UseFiltersManagerReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const trackedKeys = useMemo(
    () => [...keys, ORDER_KEYS.ORDEN],
    [keys],
  );

  const values = useMemo(
    () =>
      Object.fromEntries(
        trackedKeys.map((key) => [key, searchParams.get(key) ?? undefined]),
      ),
    [searchParams, trackedKeys],
  );

  const navigateWithParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      if (historyMode === "push") {
        router.push(href, { scroll: false });
        return;
      }
      router.replace(href, { scroll: false });
    },
    [historyMode, pathname, router, searchParams],
  );

  const applyPageReset = useCallback(
    (params: URLSearchParams) => {
      if (!resetPageOnFilterChange) {
        return;
      }
      setOrDeleteParam(params, pageKey, "1");
    },
    [pageKey, resetPageOnFilterChange],
  );

  const handleChange = useCallback(
    (key: string, value?: string) => {
      navigateWithParams((params) => {
        setOrDeleteParam(params, key, value);
        applyPageReset(params);
      });
    },
    [applyPageReset, navigateWithParams],
  );

  const handleRemove = useCallback(
    (key: string) => {
      navigateWithParams((params) => {
        params.delete(key);
        applyPageReset(params);
      });
    },
    [applyPageReset, navigateWithParams],
  );

  const handleBatchChange = useCallback(
    (updates: Record<string, string | undefined>) => {
      navigateWithParams((params) => {
        Object.entries(updates).forEach(([key, value]) => {
          setOrDeleteParam(params, key, value);
        });
        applyPageReset(params);
      });
    },
    [applyPageReset, navigateWithParams],
  );

  const handleSort = useCallback(
    (column: string, direction: "ASC" | "DESC") => {
      navigateWithParams((params) => {
        params.delete(ORDER_KEYS.ORDER_BY);
        params.delete(ORDER_KEYS.ORDER_DIRECTION);
        setOrDeleteParam(
          params,
          ORDER_KEYS.ORDEN,
          `${column}-${orderDirectionToUrlSegment(direction)}`,
        );
      });
    },
    [navigateWithParams],
  );

  const handleDateRangeChange = useCallback(
    (fromKey: string, toKey: string, range: FiltersDateRangeValue) => {
      navigateWithParams((params) => {
        if (range.from) {
          params.set(fromKey, format(range.from, "yyyy-MM-dd"));
        } else {
          params.delete(fromKey);
        }
        if (range.to) {
          params.set(toKey, format(range.to, "yyyy-MM-dd"));
        } else {
          params.delete(toKey);
        }
        applyPageReset(params);
      });
    },
    [applyPageReset, navigateWithParams],
  );

  const handleNumericRangeChange = useCallback(
    (sinceKey: string, untilKey: string, range: FiltersNumericRangeValue) => {
      handleBatchChange({
        [sinceKey]: range.since,
        [untilKey]: range.until,
      });
    },
    [handleBatchChange],
  );

  return {
    values,
    handleChange,
    handleRemove,
    handleBatchChange,
    handleSort,
    handleDateRangeChange,
    handleNumericRangeChange,
  };
};
