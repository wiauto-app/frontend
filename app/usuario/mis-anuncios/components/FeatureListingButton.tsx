"use client";

import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { useFeatureListingAction } from "../hooks/useMyListingMutations";

interface FeatureListingButtonProps {
  listing: OwnerVehicleListItem;
  variant?: "outline" | "default";
}

const canShowFeatureButton = (listing: OwnerVehicleListItem): boolean =>
  listing.can_feature && !listing.is_featured_active;

export const FeatureListingButton = ({
  listing,
  variant = "outline",
}: FeatureListingButtonProps) => {
  const {
    featureListing,
    featurePriceLabel,
    isFeaturing,
    canFeatureIncluded,
    availableFeaturedCredits,
  } = useFeatureListingAction();

  if (!canShowFeatureButton(listing)) {
    return null;
  }

  const handleClick = async () => {
    if (isFeaturing) {
      return;
    }

    const willUseIncludedOrCredit =
      canFeatureIncluded || availableFeaturedCredits > 0;

    try {
      await featureListing(listing.id);
      if (willUseIncludedOrCredit) {
        toast.success("Anuncio destacado correctamente");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo destacar el anuncio";
      toast.error(message);
    }
  };

  const label = featurePriceLabel ? `Destacar · ${featurePriceLabel}` : "Destacar";

  if (variant === "default") {
    return (
      <Button
        type="button"
        size="sm"
        className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-white disabled:opacity-100"
        disabled={isFeaturing}
        onClick={() => void handleClick()}
        aria-label={`Destacar anuncio ${listing.display_name}`}
      >
        {isFeaturing ? (
          <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden />
        ) : (
          <Star className="mr-1.5 size-3.5 fill-current" aria-hidden />
        )}
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isFeaturing}
      onClick={() => void handleClick()}
      aria-label={`Destacar anuncio ${listing.display_name}`}
    >
      {isFeaturing ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : (
        <Star aria-hidden className="fill-current" />
      )}
      {label}
    </Button>
  );
};
