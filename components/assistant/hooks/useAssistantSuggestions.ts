"use client";

import { useQuery } from "@tanstack/react-query";
import { assistantSuggestionsService } from "@/services/assistant/assistantSuggestionsService";
import type { AssistantPageRoute } from "../utils/assistantPageContext";

const PLACEHOLDER_BY_ROUTE = {
  "/": [
    { label: "¿Qué es WiAuto?", prompt: "Explícame qué es WiAuto y cómo puede ayudarme." },
    { label: "Encontrar mi próximo coche", prompt: "Ayúdame a encontrar mi próximo coche con WiAuto." },
  ],
  "/vehiculos": [
    { label: "Coche para mi presupuesto", prompt: "Ayúdame a buscar un coche que encaje con mi presupuesto y necesidades." },
    { label: "Comparar dos modelos", prompt: "Quiero comparar dos modelos antes de decidir cuál comprar." },
  ],
  "/concesionarias": [
    { label: "Concesionarias cercanas", prompt: "Busca concesionarias cerca de mi ubicación." },
    { label: "Mejor valoradas", prompt: "Enséñame concesionarias con buenas valoraciones." },
  ],
  "/noticias": [
    { label: "Noticias destacadas", prompt: "Muéstrame las noticias destacadas más recientes de WiAuto." },
    { label: "Novedades del motor", prompt: "Quiero conocer las novedades recientes del mundo del motor." },
  ],
} as const;

const CONTEXT_BY_ROUTE = {
  "/": "home",
  "/vehiculos": "vehicles",
  "/concesionarias": "dealerships",
  "/noticias": "news",
} as const;

export const useAssistantSuggestions = (route: AssistantPageRoute) =>
  useQuery({
    queryKey: ["assistant-suggestions", route],
    queryFn: () => assistantSuggestionsService.getByRoute(route),
    placeholderData: {
      route,
      context: CONTEXT_BY_ROUTE[route],
      suggestions: [...PLACEHOLDER_BY_ROUTE[route]],
    },
    staleTime: 14 * 24 * 60 * 60 * 1000,
    gcTime: 14 * 24 * 60 * 60 * 1000,
  });
