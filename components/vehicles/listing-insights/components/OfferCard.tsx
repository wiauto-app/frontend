import { Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FeaturedListingOffer } from "@/interfaces/billing.interface";
import { formatEurosCents } from "../utils/listing-insights-format";

interface OfferCardProps {
  offer: FeaturedListingOffer;
  isFeatureLoading: boolean;
  handleFeatureClick: (offerId: string) => void;
  ctaLabel?: string;
  /** Resta énfasis visual (p. ej. cuando conviene arreglar el anuncio antes). */
  muted?: boolean;
}

export const OfferCard = ({
  offer,
  isFeatureLoading,
  handleFeatureClick,
  ctaLabel = "Destacar",
  muted = false,
}: OfferCardProps) => {
  return (
    <li>
      <Card size="sm">
        <CardContent>
          <div className="space-y-2">
            <div className="flex w-full items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold">
                {offer.title} <Zap className="size-4 text-primary" aria-hidden />
              </p>
              <Badge>{offer.duration_days} días</Badge>
            </div>
            <p className="text-base font-bold">
              {formatEurosCents(offer.amount_cents)}
            </p>
            <p className="text-sm">{offer.description}</p>

            <Button
              type="button"
              variant={muted ? "outline" : "default"}
              className="w-full rounded-full"
              disabled={isFeatureLoading || !offer.stripe_price_id}
              onClick={() => {
                void handleFeatureClick(offer.id);
              }}
              aria-label={`${ctaLabel} con ${offer.title}`}
            >
              <Star className="size-4 fill-current" aria-hidden />
              {isFeatureLoading ? "..." : ctaLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
};
