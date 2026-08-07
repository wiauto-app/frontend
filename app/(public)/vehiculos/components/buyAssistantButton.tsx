"use client";

import { useRouter } from "next/navigation";
import { ASSISTANT_KEYS } from "@/components/assistant/constants/assistantKeys.constants";
import { saveBuyAssistantInitialFilters } from "@/components/assistant/utils/buyAssistantSessionStorage";
import { pickSearchFiltersFromListing } from "@/components/assistant/utils/pickSearchFiltersFromListing";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { IAButton } from "@/components/ui/iaButton";
import { ArrowRight, Sparkles } from "lucide-react";

export const BuyAssistantButton = () => {
  const router = useRouter();
  const { filters } = useVehiclesListingFilters();

  const handleClick = () => {
    const initialFilters = pickSearchFiltersFromListing(filters);
    saveBuyAssistantInitialFilters(initialFilters);
    router.push(`/asistente/chat?${ASSISTANT_KEYS.BUY_ASSISTANT_KEY}=true`);
  };

  return (
    <IAButton
      type="button"
      size="2xl"
      className="rounded-2xl max-w-xl text-lg font-semibold w-fit"
      aria-label="Abrir asistente de compra con los filtros actuales"
      onClick={handleClick}
    >
      <Sparkles className="size-6" />
      Asistente de compra <ArrowRight className="size-5" />
    </IAButton>
  );
};
