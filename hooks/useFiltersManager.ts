"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { ORDER_KEYS } from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";

export type FiltersDateRangeValue = {
  from?: Date;
  to?: Date;
};

type FilterValue = string | string[] | undefined;

interface UseFiltersManagerProps {
  keys: string[];
}

interface UseFiltersManagerReturn {
  values: Record<string, FilterValue>;

  handleChange: (key: string, value?: string) => void;

  handleMultiChange: (
    key: string,
    values: string[],
  ) => void;

  handleMultiKeysChange: (
    updates: Record<string, string[] | undefined>,
  ) => void;

  applyUrlUpdates: (
    updates: Record<string, string | string[] | undefined>,
  ) => void;

  handleAddValue: (
    key: string,
    value: string,
  ) => void;

  handleRemoveValue: (
    key: string,
    value: string,
  ) => void;

  handleToggleValue: (
    key: string,
    value: string,
  ) => void;

  handleRemove: (key: string) => void;

  handleClearAll: () => void;

  handleSort: (
    column: string,
    direction: "ASC" | "DESC",
  ) => void;

  handleDateRangeChange: (
    fromKey: string,
    toKey: string,
    range: FiltersDateRangeValue,
  ) => void;
}

export const useFiltersManager = ({
  keys,
}: UseFiltersManagerProps): UseFiltersManagerReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortKeys = [
    ORDER_KEYS.ORDER_BY,
    ORDER_KEYS.ORDER_DIRECTION,
  ];

  const updateParams = (params: URLSearchParams) => {
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    const currentQuery = searchParams.toString();
    const currentUrl = currentQuery
      ? `${pathname}?${currentQuery}`
      : pathname;

    if (nextUrl === currentUrl) {
      return;
    }

    router.replace(nextUrl, { scroll: false });
  };

  const values = useMemo(() => {
    const result: Record<string, FilterValue> = {};

    [...keys, ...sortKeys].forEach((key) => {
      const allValues = searchParams.getAll(key);

      if (allValues.length === 0) {
        result[key] = undefined;
        return;
      }

      if (allValues.length === 1) {
        result[key] = allValues[0];
        return;
      }

      result[key] = allValues;
    });

    return result;
  }, [keys, searchParams]);

  const handleChange = (
    key: string,
    value?: string,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    updateParams(params);
  };

  const handleMultiChange = (
    key: string,
    values: string[],
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete(key);

    values.forEach((value) => {
      params.append(key, value);
    });

    updateParams(params);
  };

  const handleMultiKeysChange = (
    updates: Record<string, string[] | undefined>,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    Object.entries(updates).forEach(([key, values]) => {
      params.delete(key);

      if (values?.length) {
        values.forEach((value) => {
          params.append(key, value);
        });
      }
    });

    updateParams(params);
  };

  const applyUrlUpdates = (
    updates: Record<string, string | string[] | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key);

      if (value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          params.append(key, item);
        });
        return;
      }

      params.set(key, value);
    });

    updateParams(params);
  };

  const handleAddValue = (
    key: string,
    value: string,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const currentValues = params.getAll(key);

    if (!currentValues.includes(value)) {
      params.append(key, value);
    }

    updateParams(params);
  };

  const handleRemoveValue = (
    key: string,
    value: string,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const remainingValues = params
      .getAll(key)
      .filter((item) => item !== value);

    params.delete(key);

    remainingValues.forEach((item) => {
      params.append(key, item);
    });

    updateParams(params);
  };

  const handleToggleValue = (
    key: string,
    value: string,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const currentValues = params.getAll(key);

    const exists = currentValues.includes(value);

    params.delete(key);

    if (exists) {
      currentValues
        .filter((item) => item !== value)
        .forEach((item) => {
          params.append(key, item);
        });
    } else {
      [...currentValues, value].forEach((item) => {
        params.append(key, item);
      });
    }

    updateParams(params);
  };

  const handleRemove = (key: string) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete(key);

    updateParams(params);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    keys.forEach((key) => {
      params.delete(key);
    });

    updateParams(params);
  };

  const handleSort = (
    column: string,
    direction: "ASC" | "DESC",
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set(
      ORDER_KEYS.ORDER_BY,
      column,
    );

    params.set(
      ORDER_KEYS.ORDER_DIRECTION,
      direction,
    );

    updateParams(params);
  };

  const handleDateRangeChange = (
    fromKey: string,
    toKey: string,
    range: FiltersDateRangeValue,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (range.from) {
      params.set(
        fromKey,
        format(range.from, "yyyy-MM-dd"),
      );
    } else {
      params.delete(fromKey);
    }

    if (range.to) {
      params.set(
        toKey,
        format(range.to, "yyyy-MM-dd"),
      );
    } else {
      params.delete(toKey);
    }

    updateParams(params);
  };

  return {
    values,
    handleChange,
    handleMultiChange,
    handleMultiKeysChange,
    applyUrlUpdates,
    handleAddValue,
    handleRemoveValue,
    handleToggleValue,
    handleRemove,
    handleClearAll,
    handleSort,
    handleDateRangeChange,
  };
};