import { apiGet } from "@/lib/api";
import type { AssistantPageRoute } from "@/components/assistant/utils/assistantPageContext";

export interface AssistantSuggestion {
  label: string;
  prompt: string;
}

export interface AssistantSuggestionsResponse {
  route: AssistantPageRoute;
  context: "home" | "vehicles" | "dealerships" | "news";
  suggestions: AssistantSuggestion[];
}

export const assistantSuggestionsService = {
  getByRoute: async (route: AssistantPageRoute) => {
    const response = await apiGet<AssistantSuggestionsResponse>(
      "/v1/assistant/suggestions",
      { route },
    );

    if (!response.ok || !response.data) {
      throw new Error(response.message || "No se pudieron cargar las sugerencias");
    }

    return response.data;
  },
};
