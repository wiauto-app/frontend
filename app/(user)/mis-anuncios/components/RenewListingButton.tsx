"use client";

import { Button } from "@/components/ui/button";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";

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
      className="border-blue-200 text-blue-600 hover:bg-blue-50"
      disabled={disabled}
      onClick={handleClick}
      aria-label={`Renovar anuncio ${listing.display_name}`}
    >
      Renovar
    </Button>
  );
};
