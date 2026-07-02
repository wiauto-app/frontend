"use client";

import { Spinner } from "@/components/ui/spinner";
import { AssistantVehiclesListing } from "./assistantVehiclesListing";
import { useAssistantSearchResults } from "./hooks/useAssistantSearchResults";

export const AssistantSearchPanel = () => {
  const { results, isLoading, hasResults } = useAssistantSearchResults();

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto p-1 sm:p-2">
      <AssistantVehiclesListing
        vehicles={results?.vehicles ?? []}
        total={results?.total ?? 0}
        appliedFilters={results?.appliedFilters}
        hasSearch={hasResults}
      />
    </div>
  );
};
