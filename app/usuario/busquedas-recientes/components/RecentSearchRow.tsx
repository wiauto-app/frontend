"use client";

import Link from "next/link";
import { ChevronRight, Search, X } from "lucide-react";
import type { VehicleSearchHistoryItem } from "@/interfaces/vehicle-search-history.interface";
import { buildListingHrefFromApiQuery } from "@/lib/vehicles/listing-url";
import { Button } from "@/components/ui/button";
import {
  formatAbsoluteDate,
  formatFiltersCount,
  getRecentSearchLabel,
  getRecentSearchMeta,
} from "../utils/recent-searches.utils";

type RecentSearchRowProps = {
  item: VehicleSearchHistoryItem;
  onRemove: (item: VehicleSearchHistoryItem) => void;
};

export const RecentSearchRow = ({ item, onRemove }: RecentSearchRowProps) => {
  const label = getRecentSearchLabel(item);
  const href = buildListingHrefFromApiQuery(item.query);
  const meta = getRecentSearchMeta(item);
  const filters = formatFiltersCount(item.filters_count);

  return (
    <li className="group relative flex items-center gap-1 pr-2 transition-colors hover:bg-muted/50 has-[a:focus-visible]:bg-muted/50 sm:pr-3">
      <Link
        href={href}
        data-recent-search-link
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-3.5 pl-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset sm:gap-4 sm:py-4 sm:pl-4"
      >
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Search className="size-4.5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 text-sm font-semibold text-foreground sm:text-[0.9375rem]">
            {label}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground tabular-nums sm:text-[0.8125rem]">
            {filters ? (
              <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground/70">
                {filters}
              </span>
            ) : null}
            {meta.map((part, index) => {
              const isTime = index === meta.length - 1;
              return (
                <span key={part} className="inline-flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden>·</span> : null}
                  {isTime ? (
                    <time
                      dateTime={item.last_searched_at}
                      title={formatAbsoluteDate(item.last_searched_at)}
                    >
                      {part}
                    </time>
                  ) : (
                    part
                  )}
                </span>
              );
            })}
          </span>
        </span>

        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </Link>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Eliminar «${label}» del historial`}
        onClick={() => onRemove(item)}
      >
        <X className="size-4" aria-hidden />
      </Button>
    </li>
  );
};
