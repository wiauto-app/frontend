import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type DealerReviewStarsProps = {
  rating: number;
  className?: string;
  label?: string;
};

export function DealerReviewStars({
  rating,
  className,
  label = `${rating} de 5 estrellas`,
}: DealerReviewStarsProps) {
  const normalized_rating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index < normalized_rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}
