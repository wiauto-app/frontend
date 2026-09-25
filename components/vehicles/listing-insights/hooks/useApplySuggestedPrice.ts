"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { vehicleInsightsService } from "../services/vehicleInsightsService";
import { formatPriceEur } from "../utils/listing-insights-format";
import {
  MY_LISTINGS_QUERY_KEY,
  vehicleInsightsQueryKey,
} from "./listing-insights-query-keys";

interface ApplySuggestedPriceVariables {
  vehicleId: string;
  price: number;
}

export const useApplySuggestedPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, price }: ApplySuggestedPriceVariables) => {
      const response = await vehicleInsightsService.updatePrice(
        vehicleId,
        price,
      );
      if (!response.ok) {
        throw new Error(response.message || "No se pudo actualizar el precio");
      }
      return response.data;
    },
    onSuccess: async (_data, { vehicleId, price }) => {
      toast.success(`Precio actualizado a ${formatPriceEur(price)}`);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: vehicleInsightsQueryKey(vehicleId),
        }),
        queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el precio",
      );
    },
  });
};
