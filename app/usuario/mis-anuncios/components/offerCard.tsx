import { Button } from "@/components/ui/button";
import { FeaturedListingOffer } from "@/interfaces/billing.interface";
import { Star, Zap } from "lucide-react";
import { formatEurosCents } from "../../inicio/components/dashboard/dashboard.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OfferCardProps {
  offer: FeaturedListingOffer;
  isFeatureLoading: boolean;
  handleFeatureClick: (offerId: string) => void;
}
export const OfferCard = ({
  offer,
  isFeatureLoading,
  handleFeatureClick,
}: OfferCardProps) => {
  return (
    <li>
      <Card size="sm">
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between w-full ">
              <p className="text-sm font-semibold flex items-center gap-2">
                {offer.title} <Zap className="text-primary size-4" />
              </p>
              <Badge >
                {offer.duration_days} días
              </Badge>
            </div>
            <p className="text-base font-bold">
              {formatEurosCents(offer.amount_cents)}
            </p>
            <p className="text-sm ">{offer.description}</p>

            <Button
              type="button"
              className="rounded-full w-full"
              disabled={isFeatureLoading || !offer.stripe_price_id}
              onClick={() => {
                void handleFeatureClick(offer.id);
              }}
              aria-label={`Destacar anuncio con ${offer.title}`}
            >
              <Star className="size-4 fill-current" aria-hidden />
              {isFeatureLoading ? "..." : "Destacar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
};
