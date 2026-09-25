"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OwnerListingHealthSummary } from "@/interfaces/vehicle-insights.interface";
import {
  HEALTH_TIER_CHIP_CLASS,
  HEALTH_TIER_LABEL,
} from "../utils/listing-insights-format";
import { useListingDiagnosticStore } from "../stores/listingDiagnosticStore";

interface ListingHealthBadgeProps {
  health: OwnerListingHealthSummary;
  listingName: string;
  vehicleId: string;
  className?: string;
}

export const ListingHealthBadge = ({
  health,
  listingName,
  vehicleId,
  className,
}: ListingHealthBadgeProps) => {
  const openDiagnostic = useListingDiagnosticStore(
    (state) => state.openDiagnostic,
  );
  const score = Math.round(health.score);
  const summary = health.top_issue
    ? health.top_issue.title
    : HEALTH_TIER_LABEL[health.tier];
  const extraIssues = Math.max(0, health.issues_count - 1);

  const handleClick = () => {
    openDiagnostic(vehicleId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-haspopup="dialog"
      aria-label={`Ver diagnóstico de ${listingName}. Puntuación ${score} de 100. ${summary}`}
      className={cn(
        "group inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card py-1 pr-2 pl-1 text-left text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-fit",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex h-5 min-w-8 items-center justify-center rounded-full px-1.5 font-bold tabular-nums",
          HEALTH_TIER_CHIP_CLASS[health.tier],
        )}
        aria-hidden
      >
        {score}
      </span>
      <span className="truncate font-medium text-foreground" aria-hidden>
        {summary}
      </span>
      {extraIssues > 0 ? (
        <span className="shrink-0 text-muted-foreground" aria-hidden>
          +{extraIssues}
        </span>
      ) : null}
      <ChevronRight
        className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden
      />
    </button>
  );
};
