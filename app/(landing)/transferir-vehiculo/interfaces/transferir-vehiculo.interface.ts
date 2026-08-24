import type { LucideIcon } from "lucide-react";

/** Badge de confianza del hero (solo texto). */
export interface HeroTrustBadge {
  label: string;
}

/** Trámite de papeleo que gestiona WiAuto. */
export interface PaperService {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Paso del proceso de transferencia. */
export interface TransferStep {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Vehículo vendido por el usuario (mock). */
export interface SoldVehicle {
  badge: string;
  model: string;
  version: string;
  plate: string;
  year: string;
  km: string;
  buyer: string;
  image: string;
}

/** Beneficio listado junto al formulario. */
export interface TransferFormBenefit {
  icon: LucideIcon;
  text: string;
}

/** Estado de un paso del preview del trámite. */
export type PreviewStepStatus = "done" | "active" | "pending";

/** Fila del preview del proceso de transferencia. */
export interface PreviewStep {
  number: number;
  label: string;
  status: PreviewStepStatus;
}
