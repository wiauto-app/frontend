import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type DealershipRatingStarsProps = {
  rating: number | null;
  className?: string;
};

const STAR_COUNT = 5;

const clampRating = (rating: number): number =>
  Math.min(STAR_COUNT, Math.max(0, rating));

const StarIcon = ({ fill }: { fill: number }) => (
  <div className="relative size-3.5 shrink-0" aria-hidden>
    <Star className="size-3.5 text-white/35" />
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ width: `${fill * 100}%` }}
    >
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
    </div>
  </div>
);

export const DealershipRatingStars = ({
  rating,
  className,
}: DealershipRatingStarsProps) => {
  if (rating === null) {
    return (
      <p className={cn("text-xs font-medium text-white/75", className)}>
        Sin valoraciones
      </p>
    );
  }

  const normalized = clampRating(rating);

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={`Valoración ${normalized.toFixed(1)} de ${STAR_COUNT}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const fill = Math.min(1, Math.max(0, normalized - index));
          return <StarIcon key={index} fill={fill} />;
        })}
      </div>
      <span className="text-xs font-semibold text-white/90">
        {normalized.toFixed(1)}
      </span>
    </div>
  );
};
