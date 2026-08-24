import type { LucideIcon } from 'lucide-react';

export interface SampleVehicle {
  make: string;
  model: string;
  variant: string;
  year: number;
  power: string;
  vin: string;
  image: string;
  heroImage: string;
  mileage: string;
  owners: string;
  adminStatus: string;
  inspections: string;
  incidents: string;
  lastUpdate: string;
}

export interface TrustItem {
  icon: LucideIcon;
  label: string;
}

export interface DiscoveryFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export type ReportCheckStatus = 'ok' | 'warning';

export interface ReportCheck {
  label: string;
  status: ReportCheckStatus;
}

export interface HowItWorksStep {
  icon: LucideIcon;
  title: string;
  description: string;
}
