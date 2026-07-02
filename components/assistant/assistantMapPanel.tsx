"use client";

import { Spinner } from "@/components/ui/spinner";
import { AssistantSearchMap } from "./assistantSearchMap";
import { useAssistantSearchResults } from "./hooks/useAssistantSearchResults";

export const AssistantMapPanel = () => {
  const { results, isLoading, hasResults } = useAssistantSearchResults();

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  const vehicles = results?.vehicles ?? [];

  if (!hasResults || vehicles.length === 0) {
    return (
      <div className="flex h-full flex-1 items-center justify-center px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Realiza una búsqueda en el chat para ver los vehículos en el mapa.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-lg border border-slate-100 bg-white">
      <AssistantSearchMap fullHeight vehicles={vehicles} />
    </div>
  );
};
