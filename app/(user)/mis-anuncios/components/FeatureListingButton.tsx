"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";

type FeatureListingButtonProps = {
  listing: OwnerVehicleListItem;
  onFeature: (id: string) => Promise<void>;
  disabled?: boolean;
  variant?: "outline" | "default";
  priceLabel?: string | null;
};

export const FeatureListingButton = ({
  listing,
  onFeature,
  disabled = false,
  variant = "outline",
  priceLabel,
}: FeatureListingButtonProps) => {
  if (listing.is_featured_active || !listing.can_feature) {
    return null;
  }

  const handleClick = async () => {
    await onFeature(listing.id);
  };

  const label = priceLabel ? `Destacar · ${priceLabel}` : "Destacar";

  if (variant === "default") {
    return (
      <Button
        type="button"
        size="sm"
        className="bg-blue-600 text-white hover:bg-blue-700"
        disabled={disabled}
        onClick={handleClick}
        aria-label={`Destacar anuncio ${listing.display_name}`}
      >
        <Star className="mr-1.5 size-3.5 fill-current" aria-hidden />
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-gray-200 text-gray-700 hover:bg-gray-50"
      disabled={disabled}
      onClick={handleClick}
      aria-label={`Destacar anuncio ${listing.display_name}`}
    >
      <Star className="mr-1.5 size-3.5 text-amber-500" aria-hidden />
      {label}
    </Button>
  );
};
