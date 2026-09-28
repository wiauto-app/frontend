"use client";

import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simpleTooltip";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { useFeatureListingAction } from "../hooks/useMyListingMutations";

interface FeatureListingButtonProps {
  listing: OwnerVehicleListItem;
  variant?: "outline" | "default";
}

const getDisabledReason = (listing: OwnerVehicleListItem): string | undefined => {
  if (listing.is_featured_active) {
    return "Ya está destacado";
  }
  if (!listing.can_feature) {
    return "Solo se pueden destacar anuncios activos";
  }
  return undefined;
};

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

  const disabledReason = getDisabledReason(listing);
  const isUnavailable = Boolean(disabledReason);
  const isDisabled = isUnavailable || isFeaturing;

  const handleClick = async () => {
    if (isDisabled) {
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

  const label =
    !isUnavailable && featurePriceLabel
      ? `Destacar · ${featurePriceLabel}`
      : "Destacar";

  const button =
    variant === "default" ? (
      <Button
        type="button"
        size="sm"
        className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-white disabled:opacity-100"
        disabled={isDisabled}
        onClick={() => void handleClick()}
        aria-label={
          disabledReason
            ? `Destacar anuncio ${listing.display_name}. ${disabledReason}`
            : `Destacar anuncio ${listing.display_name}`
        }
        aria-disabled={isDisabled}
      >
        {isFeaturing ? (
          <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden />
        ) : (
          <Star className="mr-1.5 size-3.5 fill-current" aria-hidden />
        )}
        {label}
      </Button>
    ) : (
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isDisabled}
        className="disabled:opacity-60"
        onClick={() => void handleClick()}
        aria-label={
          disabledReason
            ? `Destacar anuncio ${listing.display_name}. ${disabledReason}`
            : `Destacar anuncio ${listing.display_name}`
        }
        aria-disabled={isDisabled}
      >
        {isFeaturing ? (
          <Loader2 className="animate-spin" aria-hidden />
        ) : (
          <Star aria-hidden className="fill-current" />
        )}
        {label}
      </Button>
    );

  if (disabledReason) {
    return (
      <SimpleTooltip content={disabledReason} side="top">
        {button}
      </SimpleTooltip>
    );
  }

  return button;
};
