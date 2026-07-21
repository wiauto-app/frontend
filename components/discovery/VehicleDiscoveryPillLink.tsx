import Link from "next/link";
import type { DiscoveryPillLink } from "./types";
import { Badge } from "../ui/badge";

interface VehicleDiscoveryPillLinkProps {
  pill: DiscoveryPillLink;
}

export const VehicleDiscoveryPillLink = ({
  pill,
}: VehicleDiscoveryPillLinkProps) => (
  <Link href={pill.href} aria-label={`Ver vehículos: ${pill.label}`}>
    <Badge variant="outline" className="text-sm h-8 px-4 hover:bg-primary/10 hover:text-primary hover:ring-2 hover:ring-primary">{pill.label}</Badge>
  </Link>
);
