"use client";

import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simpleTooltip";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { useRenewListingMutation } from "../hooks/useMyListingMutations";

interface RenewListingButtonProps {
  listing: OwnerVehicleListItem;
}

export const RenewListingButton = ({ listing }: RenewListingButtonProps) => {
  const renewMutation = useRenewListingMutation();
  const cannotRenew = !listing.can_renew;
  const isDisabled = cannotRenew || renewMutation.isPending;

  const handleClick = async () => {
    if (isDisabled) {
      return;
    }

    try {
      await renewMutation.mutateAsync(listing.id);
      toast.success("Anuncio renovado correctamente");
    } catch {
      toast.error("No se pudo renovar el anuncio");
    }
  };

  const button = (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      disabled={isDisabled}
      onClick={() => void handleClick()}
      aria-label={
        cannotRenew
          ? `Renovar anuncio ${listing.display_name}. Disponible cada 7 días`
          : `Renovar anuncio ${listing.display_name}`
      }
      aria-disabled={isDisabled}
    >
      {renewMutation.isPending ? (
        <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden />
      ) : (
        <RefreshCcw data-icon="inline-start" aria-hidden />
      )}
      Renovar
    </Button>
  );

  if (cannotRenew) {
    return (
      <SimpleTooltip content="Disponible cada 7 días" side="top">
        {button}
      </SimpleTooltip>
    );
  }

  return button;
};
