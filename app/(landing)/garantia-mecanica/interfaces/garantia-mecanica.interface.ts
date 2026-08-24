import type { LucideIcon } from "lucide-react";

/** Badge de confianza mostrado en el hero. */
export interface GuaranteeTrustBadge {
  icon: LucideIcon;
  label: string;
}

/** Componente del vehículo cubierto por la garantía. */
export interface ProtectedPart {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Beneficio destacado de la garantía mecánica. */
export interface GuaranteeBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}
