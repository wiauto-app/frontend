import { apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type {
  CreateReportDto,
  PaginatedReportCategoriesResponse,
  ReportCategory,
  ReportListItem,
  ReportTargetType,
} from "@/interfaces/report.interface";

export const reportService = {
  findCategories: (
    params?: {
      target_type?: ReportTargetType;
      page?: number;
      limit?: number;
    },
  ): Promise<ApiResponse<PaginatedReportCategoriesResponse>> =>
    apiGet<PaginatedReportCategoriesResponse>("/v1/report-categories", {
      target_type: params?.target_type,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      order_by: "name",
      order_direction: "ASC",
    }),

  create: (data: CreateReportDto): Promise<ApiResponse<ReportListItem>> =>
    apiPost<ReportListItem>("/v1/reports", data),
};

export type { ReportCategory };
