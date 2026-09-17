"use client";

import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { useRenewListingMutation } from "../hooks/useMyListingMutations";

interface RenewListingButtonProps {
  listing: OwnerVehicleListItem;
}

export const RenewListingButton = ({ listing }: RenewListingButtonProps) => {
  const renewMutation = useRenewListingMutation();

  if (!listing.can_renew) {
    return null;
  }

  const handleClick = async () => {
    try {
      await renewMutation.mutateAsync(listing.id);
      toast.success("Anuncio renovado correctamente");
    } catch {
      toast.error("No se pudo renovar el anuncio");
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-gray-200 text-gray-700 hover:bg-gray-50"
      disabled={renewMutation.isPending}
      onClick={() => void handleClick()}
      aria-label={`Renovar anuncio ${listing.display_name}`}
    >
      {renewMutation.isPending ? (
        <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden />
      ) : (
        <RefreshCcw data-icon="inline-start" aria-hidden />
      )}
      Renovar
    </Button>
  );
};
