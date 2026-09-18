import { apiGet, apiPostBlob } from "@/lib/api";
import type { OwnerDashboardResponse } from "@/interfaces/owner-dashboard.interface";
import {
  V1_OWNER_DASHBOARD,
  V1_OWNER_DASHBOARD_EXPORT,
} from "./route.constants";

interface GetDashboardParams {
  startDate: string;
  endDate: string;
}

const buildDateRangeQuery = ({ startDate, endDate }: GetDashboardParams) =>
  new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  }).toString();

export const ownerDashboardService = {
  getDashboard(params: GetDashboardParams) {
    return apiGet<OwnerDashboardResponse>(
      `${V1_OWNER_DASHBOARD}?${buildDateRangeQuery(params)}`,
    );
  },

  exportDashboardPdf(params: GetDashboardParams) {
    return apiPostBlob(
      `${V1_OWNER_DASHBOARD_EXPORT}?${buildDateRangeQuery(params)}`,
    );
  },
};
