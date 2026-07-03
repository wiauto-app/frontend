import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuickLink } from "./types";

interface VehicleDiscoveryQuickCardsProps {
  quickLinks: QuickLink[];
  className?: string;
}

export const VehicleDiscoveryQuickCards = ({
  quickLinks,
  className,
}: VehicleDiscoveryQuickCardsProps) => (
  <div
    className={cn(
      "grid grid-cols-1 gap-4 sm:grid-cols-3",
      className,
    )}
  >
    {quickLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "group flex items-center justify-between rounded-xl border bg-white p-4 transition-colors",
          "hover:border-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        )}
        aria-label={`Explorar ${link.label}`}
      >
        <div className="min-w-0 pr-3">
          <p className="font-semibold text-foreground">{link.label}</p>
          {link.description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {link.description}
            </p>
          ) : null}
        </div>
        <ChevronRight
          className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    ))}
  </div>
);
