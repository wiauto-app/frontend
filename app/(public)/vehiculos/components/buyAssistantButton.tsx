"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MdAssistant } from "react-icons/md";
import { ASSISTANT_KEYS } from "@/components/assistant/constants/assistantKeys.constants";
import { saveBuyAssistantInitialFilters } from "@/components/assistant/utils/buyAssistantSessionStorage";
import { pickSearchFiltersFromListing } from "@/components/assistant/utils/pickSearchFiltersFromListing";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";

export const BuyAssistantButton = () => {
  const router = useRouter();
  const { filters } = useVehiclesListingFilters();

  const handleClick = () => {
    const initialFilters = pickSearchFiltersFromListing(filters);
    saveBuyAssistantInitialFilters(initialFilters);
    router.push(`/asistente/chat?${ASSISTANT_KEYS.BUY_ASSISTANT_KEY}=true`);
  };

  return (
    <Button
      type="button"
      className="w-full"
      aria-label="Abrir asistente de compra con los filtros actuales"
      onClick={handleClick}
    >
      Asistente de compra <MdAssistant aria-hidden />
    </Button>
  );
};
