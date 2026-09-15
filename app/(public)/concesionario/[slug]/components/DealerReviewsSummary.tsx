import { MessageSquareQuote, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { DealerReviewStars } from "./DealerReviewStars";

type DealerReviewsSummaryProps = {
  averageRating: number | null;
  total: number;
};

export function DealerReviewsSummary({
  averageRating,
  total,
}: DealerReviewsSummaryProps) {
  const displayed_rating = averageRating ?? 0;

  return (
    <aside className="flex h-fit flex-col gap-5 rounded-xl bg-muted/50 p-5 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-5xl font-semibold tracking-tight text-foreground">
            {displayed_rating.toFixed(1)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Promedio de {total} {total === 1 ? "reseña" : "reseñas"}
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-full bg-background text-primary ring-1 ring-border">
          <MessageSquareQuote className="size-5" aria-hidden />
        </div>
      </div>

      <DealerReviewStars
        rating={displayed_rating}
        className="gap-1"
        label={`Promedio ${displayed_rating.toFixed(1)} de 5 estrellas`}
      />


    </aside>
  );
}
