import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";

export interface VehicleReportImage {
  id: string;
  url: string;
}

export interface VehicleReportVersionSummary {
  make_name: string;
  model_name: string;
  version_name: string;
}

export interface VehicleReportPriceHistoryItem {
  id: string;
  price: number;
  status: string;
  created_at: string;
}

export interface VehicleReportStats {
  views: number;
  favorites: number;
  shares: number;
  leads: number;
  phone_clicks: number;
  whatsapp_clicks: number;
}

export interface VehicleReport {
  id: string;
  display_name: string;
  status: VehicleStatus;
  condition: string;
  price: number;
  mileage: number;
  created_at: string;
  renewed_at: string | null;
  expires_at: string;
  images: VehicleReportImage[];
  version_summary: VehicleReportVersionSummary;
  price_history: VehicleReportPriceHistoryItem[];
  stats: VehicleReportStats;
}
