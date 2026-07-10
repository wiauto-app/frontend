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
    <Badge variant="outline">{pill.label}</Badge>
  </Link>
);
