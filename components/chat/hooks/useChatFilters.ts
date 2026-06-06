"use client";

import { useFiltersManager } from "@/hooks/useFiltersManager";

const CHAT_FILTER_KEYS = ["chat_id", "search"] as const;

const CHAT_FILTER_KEYS_LIST: string[] = [...CHAT_FILTER_KEYS];

const toSingleString = (
  value: string | string[] | undefined,
): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};

export const useChatFilters = () => {
  const filters = useFiltersManager({ keys: CHAT_FILTER_KEYS_LIST });

  return {
    ...filters,
    chatId: toSingleString(filters.values.chat_id),
    search: toSingleString(filters.values.search),
  };
};
