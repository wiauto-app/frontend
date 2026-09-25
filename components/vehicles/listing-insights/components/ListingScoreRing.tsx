import { cn } from "@/lib/utils";
import type { ListingHealthTier } from "@/interfaces/vehicle-insights.interface";
import {
  HEALTH_TIER_LABEL,
  HEALTH_TIER_TEXT_CLASS,
} from "../utils/listing-insights-format";

interface ListingScoreRingProps {
  score: number;
  tier: ListingHealthTier;
  size?: "sm" | "md";
  /** Muestra el nivel y la leyenda junto al anillo. */
  showLabel?: boolean;
  className?: string;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ListingScoreRing = ({
  score,
  tier,
  size = "md",
  showLabel = true,
  className,
}: ListingScoreRingProps) => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  const dashOffset = CIRCUMFERENCE * (1 - safeScore / 100);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="img"
        aria-label={`Puntuación del anuncio: ${safeScore} de 100. ${HEALTH_TIER_LABEL[tier]}.`}
        className={cn("relative shrink-0", size === "sm" ? "size-14" : "size-20")}
      >
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={cn(
              "stroke-current transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none",
              HEALTH_TIER_TEXT_CLASS[tier],
            )}
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold tabular-nums text-foreground",
            size === "sm" ? "text-base" : "text-xl",
          )}
          aria-hidden
        >
          {safeScore}
        </span>
      </div>
      {showLabel ? (
        <div className="min-w-0">
          <p className={cn("text-sm font-semibold", HEALTH_TIER_TEXT_CLASS[tier])}>
            {HEALTH_TIER_LABEL[tier]}
          </p>
          <p className="text-xs text-muted-foreground">Puntuación sobre 100</p>
        </div>
      ) : null}
    </div>
  );
};
