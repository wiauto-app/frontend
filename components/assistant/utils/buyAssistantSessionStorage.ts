import type { SearchVehiclesInput } from "@/interfaces/search-vehicles.interface";
import { ASSISTANT_KEYS } from "../constants/assistantKeys.constants";

interface BuyAssistantConversationState {
  conversationIds: string[];
  filtersByConversationId: Record<string, SearchVehiclesInput>;
}

const emptyState = (): BuyAssistantConversationState => ({
  conversationIds: [],
  filtersByConversationId: {},
});

const readState = (): BuyAssistantConversationState => {
  if (typeof window === "undefined") {
    return emptyState();
  }

  const raw = sessionStorage.getItem(
    ASSISTANT_KEYS.BUY_ASSISTANT_CONVERSATIONS_STORAGE_KEY,
  );

  if (!raw) {
    return emptyState();
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return emptyState();
    }

    const record = parsed as Partial<BuyAssistantConversationState>;
    const conversationIds = Array.isArray(record.conversationIds)
      ? record.conversationIds.filter(
          (id): id is string => typeof id === "string" && id.length > 0,
        )
      : [];
    const filtersByConversationId =
      record.filtersByConversationId &&
      typeof record.filtersByConversationId === "object" &&
      !Array.isArray(record.filtersByConversationId)
        ? (record.filtersByConversationId as Record<string, SearchVehiclesInput>)
        : {};

    return { conversationIds, filtersByConversationId };
  } catch {
    return emptyState();
  }
};

const writeState = (state: BuyAssistantConversationState): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    ASSISTANT_KEYS.BUY_ASSISTANT_CONVERSATIONS_STORAGE_KEY,
    JSON.stringify(state),
  );
};

export const saveBuyAssistantInitialFilters = (
  filters: SearchVehiclesInput,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    ASSISTANT_KEYS.INITIAL_FILTERS_STORAGE_KEY,
    JSON.stringify(filters),
  );
};

export const readBuyAssistantInitialFilters = ():
  | SearchVehiclesInput
  | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const raw = sessionStorage.getItem(ASSISTANT_KEYS.INITIAL_FILTERS_STORAGE_KEY);

  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return undefined;
    }

    return parsed as SearchVehiclesInput;
  } catch {
    return undefined;
  }
};

export const clearBuyAssistantInitialFilters = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(ASSISTANT_KEYS.INITIAL_FILTERS_STORAGE_KEY);
};

export const markConversationAsBuyAssistant = (
  conversationId: string,
  initialFilters?: SearchVehiclesInput,
): void => {
  const state = readState();
  const conversationIds = state.conversationIds.includes(conversationId)
    ? state.conversationIds
    : [...state.conversationIds, conversationId];

  const filtersByConversationId = { ...state.filtersByConversationId };

  if (initialFilters) {
    filtersByConversationId[conversationId] = initialFilters;
  }

  writeState({ conversationIds, filtersByConversationId });
};

export const isBuyAssistantConversation = (conversationId: string): boolean => {
  return readState().conversationIds.includes(conversationId);
};

export const readBuyAssistantFiltersForConversation = (
  conversationId: string,
): SearchVehiclesInput | undefined => {
  const filters = readState().filtersByConversationId[conversationId];

  if (!filters || typeof filters !== "object" || Array.isArray(filters)) {
    return undefined;
  }

  return filters;
};

export const unmarkConversationAsBuyAssistant = (
  conversationId: string,
): void => {
  const state = readState();

  writeState({
    conversationIds: state.conversationIds.filter((id) => id !== conversationId),
    filtersByConversationId: Object.fromEntries(
      Object.entries(state.filtersByConversationId).filter(
        ([id]) => id !== conversationId,
      ),
    ),
  });
};
