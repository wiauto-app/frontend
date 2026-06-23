import { apiGet } from "@/lib/api";
import type {
  OwnerDashboardPeriod,
  OwnerDashboardResponse,
} from "@/interfaces/owner-dashboard.interface";
import { V1_OWNER_DASHBOARD } from "./route.constants";

export const ownerDashboardService = {
  getDashboard(period: OwnerDashboardPeriod = "30d") {
    const query = new URLSearchParams({ period }).toString();
    return apiGet<OwnerDashboardResponse>(`${V1_OWNER_DASHBOARD}?${query}`);
  },
};
