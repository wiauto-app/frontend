"use client";

import { Button } from "@/components/ui/button";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { RefreshCcw } from "lucide-react";

type RenewListingButtonProps = {
  listing: OwnerVehicleListItem;
  onRenew: (id: string) => Promise<void>;
  disabled?: boolean;
};

export const RenewListingButton = ({
  listing,
  onRenew,
  disabled = false,
}: RenewListingButtonProps) => {
  if (!listing.can_renew) {
    return null;
  }

  const handleClick = async () => {
    await onRenew(listing.id);
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-gray-200 text-gray-700 hover:bg-gray-50"
      disabled={disabled}
      onClick={handleClick}
      aria-label={`Renovar anuncio ${listing.display_name}`}
    >
      <RefreshCcw data-icon="inline-start" aria-hidden />
      Renovar
    </Button>
  );
};
