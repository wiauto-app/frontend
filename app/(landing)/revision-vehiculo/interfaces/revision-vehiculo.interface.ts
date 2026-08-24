import type { LucideIcon } from "lucide-react";

/** Badge de confianza mostrado en el hero. */
export interface TrustBadge {
  icon: LucideIcon;
  label: string;
}

/** Punto de inspección sobre el esquema del coche. */
export interface InspectionPoint {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Posición del marcador en porcentaje. */
  point: { x: string; y: string };
}

/** Sección de puntos de inspección (columnas del esquema). */
export interface InspectionPointsSection {
  left: InspectionPoint[];
  right: InspectionPoint[];
}

/** Beneficio de solicitar la inspección. */
export interface InspectionBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Paso del proceso "cómo funciona". */
export interface HowItWorksStep {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
}
