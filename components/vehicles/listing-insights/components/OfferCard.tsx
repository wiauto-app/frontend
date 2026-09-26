import { Calendar, CheckCircle, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FeaturedListingOffer } from "@/interfaces/billing.interface";
import { formatEurosCents } from "../utils/listing-insights-format";
import { HiCheckCircle } from "react-icons/hi";
import { IconContainer } from "@/components/ui/iconContainer";
import { FaCrown } from "react-icons/fa";

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
          <div className="space-y-4">
            <div className="flex w-full items-start justify-between gap-5">
              <div className="flex items-center gap-2">
                <IconContainer Icon={FaCrown} size="lg"/>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {offer.title}{" "}
                    <Zap className="size-4 text-primary" aria-hidden />
                  </p>
                  {offer.description ? (
                    <p className="text-xs text-muted-foreground">
                      {offer.description}
                    </p>
                  ) : null}
                </div>
              </div>
              <Badge className="rounded-md h-8 bg-primary-soft/10 text-primary">
                <Calendar /> {offer.duration_days} días
              </Badge>
            </div>

            <div className="flex items-start justify-between">
              {(offer.features ?? []).length > 0 ? (
                <ul className=" space-y-1 text-xs text-muted-foreground">
                  {offer.features.map((feature, index) => (
                    <li
                      key={`${feature}-${index}`}
                      className="flex items-center gap-2"
                    >
                      <HiCheckCircle className="text-primary size-5" />{" "}
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="text-xs  text-muted-foreground flex flex-col items-end ">
                <span className="text-xl text-black font-bold">
                  {formatEurosCents(offer.amount_cents)}
                </span>
                IVA no incluido
              </p>
            </div>
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
