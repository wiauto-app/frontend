import type { PaginatedResponse } from "./vehicle.interface";

export const REPORT_TARGET_TYPE = {
  PROFILE: "profile",
  DEALERSHIP: "dealership",
  VEHICLE: "vehicle",
} as const;

export type ReportTargetType =
  (typeof REPORT_TARGET_TYPE)[keyof typeof REPORT_TARGET_TYPE];

export type ReportCategory = {
  id: string;
  name: string;
  slug: string;
  target_type: ReportTargetType;
  created_at: string;
  updated_at: string;
};

export type ReportTarget = {
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
};

export type CreateReportDto = {
  category_id: string;
  title: string;
  description: string;
  target_type: ReportTargetType;
  target_id: string;
  file_url?: string | null;
};

export type ReportListItem = {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  status: string;
  target_type: ReportTargetType;
  target_id: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedReportCategoriesResponse = PaginatedResponse<ReportCategory>;
