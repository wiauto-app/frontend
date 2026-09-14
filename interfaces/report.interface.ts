import type { PaginatedResponse } from "./vehicle.interface";

export const REPORT_TARGET_TYPE = {
  PROFILE: "profile",
  DEALERSHIP: "dealership",
  VEHICLE: "vehicle",
  CHAT_MESSAGE: "chat_message",
  ASSISTANT_MESSAGE: "assistant_message",
} as const;

export type ReportTargetType =
  (typeof REPORT_TARGET_TYPE)[keyof typeof REPORT_TARGET_TYPE];

export interface ReportCategory {
  id: string;
  name: string;
  slug: string;
  target_type: ReportTargetType;
  created_at: string;
  updated_at: string;
}

export interface ReportTarget {
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  /** Solo para `assistant_message`: id del UIMessage. */
  targetAssistantMessageId?: string;
}

export interface CreateReportDto {
  category_id: string;
  title: string;
  description: string;
  target_type: ReportTargetType;
  target_id: string;
  file_url?: string | null;
  target_assistant_message_id?: string;
}

export interface ReportListItem {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  status: string;
  target_type: ReportTargetType;
  target_id: string;
  created_at: string;
  updated_at: string;
}

export type PaginatedReportCategoriesResponse = PaginatedResponse<ReportCategory>;
