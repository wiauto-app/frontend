import { BadgeCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/utils";
import type { DealershipReviewListItem } from "@/services/dealerships/dealershipReviewService";

import { DealerReviewStars } from "./DealerReviewStars";

type DealerReviewCardProps = {
  review: DealershipReviewListItem;
  isLast: boolean;
};

const formatReviewDate = (created_at: string): string => {
  const date = new Date(created_at);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getInitials = (author: string): string =>
  author
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

export function DealerReviewCard({ review, isLast }: DealerReviewCardProps) {
  const formatted_date = formatReviewDate(review.created_at);

  return (
    <article className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <Avatar size="lg">
          {review.avatar_url ? (
            <AvatarImage src={getImageUrl(review.avatar_url)} alt={review.author} />
          ) : null}
          <AvatarFallback>{getInitials(review.author)}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-semibold text-foreground">
                  {review.author}
                </h3>
                <Badge variant="secondary">
                  <BadgeCheck data-icon="inline-start" />
                  Usuario de WiAuto
                </Badge>
              </div>
              {formatted_date ? (
                <time
                  dateTime={review.created_at}
                  className="text-xs text-muted-foreground"
                >
                  {formatted_date}
                </time>
              ) : null}
            </div>

            <DealerReviewStars rating={review.rating} />
          </div>

          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {review.comment}
          </p>
        </div>
      </div>

      {!isLast ? <Separator /> : null}
    </article>
  );
}
