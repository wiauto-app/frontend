import type { PaginatedResult } from "@/types/general.types";

export interface VehicleList {
  id: string;
  profile_id: string;
  is_default: boolean;
  name: string;
  description: string | null;
  created_at: string;
  item_count: number;
  items?: VehicleListItemRecord[];
}

export type VehicleListItemsPage = PaginatedResult<VehicleListItemRecord>;

export interface VehicleListItemCategory {
  id: string;
  name: string;
}

import type { VehicleVersionSummary } from "@/interfaces/vehicle.interface";

export interface VehicleListItemPreview {
  id: string;
  version_summary: VehicleVersionSummary;
  price: number;
  image_url: string | null;
  created_at: string;
  condition: string;
  is_featured: boolean;
  category: VehicleListItemCategory | null;
  publisher_id: string;
  publisher_name: string;
  previous_price: number | null;
  price_change: number | null;
}

export interface VehicleListItemRecord {
  id: string;
  vehicle_list_id: string;
  vehicle_id: string;
  created_at: string;
  vehicle: VehicleListItemPreview;
}

export interface VehicleListDetail extends VehicleList {
  items: VehicleListItemRecord[];
}

export interface CreateVehicleListDto {
  name: string;
  description?: string | null;
  is_default?: boolean;
}

export interface UpdateVehicleListDto {
  name?: string;
  description?: string | null;
  is_default?: boolean;
}

export interface AddVehicleListItemDto {
  vehicle_id: string;
}

export interface FindVehicleListItemsParams {
  page?: number;
  limit?: number;
}

export const VEHICLE_SHARE_PLATFORMS = {
  WHATSAPP: "whatsapp",
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
  COPY_LINK: "copy_link",
} as const;

export type VehicleSharePlatform =
  (typeof VEHICLE_SHARE_PLATFORMS)[keyof typeof VEHICLE_SHARE_PLATFORMS];

export const VEHICLE_SHARE_SOURCE = {
  VEHICLE_LIST_CARD: "vehicle_list_card",
  VEHICLE_DETAIL: "vehicle_detail",
} as const;

export type VehicleShareSource =
  (typeof VEHICLE_SHARE_SOURCE)[keyof typeof VEHICLE_SHARE_SOURCE];

export type RecordVehicleShareDto = {
  platform: VehicleSharePlatform;
  source: VehicleShareSource | string;
  user_id?: string;
};
