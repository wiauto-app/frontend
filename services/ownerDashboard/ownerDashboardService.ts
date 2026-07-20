import { apiGet } from "@/lib/api";
import type { OwnerDashboardResponse } from "@/interfaces/owner-dashboard.interface";
import { V1_OWNER_DASHBOARD } from "./route.constants";

interface GetDashboardParams {
  startDate: string;
  endDate: string;
}

export const ownerDashboardService = {
  getDashboard({ startDate, endDate }: GetDashboardParams) {
    const query = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    }).toString();

    return apiGet<OwnerDashboardResponse>(`${V1_OWNER_DASHBOARD}?${query}`);
  },
};
