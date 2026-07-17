import type {
  AiSearchFiltersResponse,
  SearchVehiclesInput,
} from "@/interfaces/search-vehicles.interface";
import { fetchOptionalAuth } from "@/lib/api";

export const V1_SEARCH_AI_FILTERS = "/v1/search/ai-filters";

export const AI_SEARCH_FILTERS_RATE_LIMIT_MESSAGE =
  "Has alcanzado el límite de búsquedas con IA. Espera un momento e inténtalo de nuevo.";

export class AiSearchFiltersError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AiSearchFiltersError";
  }
}

export const isAiSearchFiltersRateLimited = (
  error: unknown,
): error is AiSearchFiltersError =>
  error instanceof AiSearchFiltersError && error.status === 429;

export const resolveAiSearchFilters = async (
  message: string,
): Promise<SearchVehiclesInput> => {
  const response = await fetchOptionalAuth<AiSearchFiltersResponse>(
    V1_SEARCH_AI_FILTERS,
    {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: { "Content-Type": "application/json" },
    },
  );

  if (response.status === 429) {
    throw new AiSearchFiltersError(
      AI_SEARCH_FILTERS_RATE_LIMIT_MESSAGE,
      429,
    );
  }

  if (!response.ok) {
    throw new AiSearchFiltersError(
      response.message || "No pudimos procesar tu búsqueda.",
      response.status,
    );
  }

  return response.data?.filters ?? {};
};
