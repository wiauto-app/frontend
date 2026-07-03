import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DiscoveryPillLink } from "./types";

interface VehicleDiscoveryPillLinkProps {
  pill: DiscoveryPillLink;
  className?: string;
}

export const VehicleDiscoveryPillLink = ({
  pill,
  className,
}: VehicleDiscoveryPillLinkProps) => (
  <Link
    href={pill.href}
    className={cn(
      "inline-flex items-center rounded-full border bg-white px-3 py-1.5 text-sm text-muted-foreground transition-colors",
      "hover:border-primary hover:text-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      className,
    )}
    aria-label={`Ver vehículos: ${pill.label}`}
  >
    {pill.label}
  </Link>
);
