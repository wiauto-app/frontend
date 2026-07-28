import { apiGet } from "@/lib/api";
import type {
  OwnerStatisticsGranularity,
  OwnerStatisticsResponse,
} from "@/interfaces/owner-statistics.interface";

import { V1_OWNER_STATISTICS } from "./route.constants";

interface GetStatisticsParams {
  since: string;
  until: string;
  granularity?: OwnerStatisticsGranularity;
}

export const ownerStatisticsService = {
  getStatistics({ since, until, granularity }: GetStatisticsParams) {
    const query = new URLSearchParams({
      since,
      until,
      ...(granularity ? { granularity } : {}),
    }).toString();

    return apiGet<OwnerStatisticsResponse>(`${V1_OWNER_STATISTICS}?${query}`);
  },
};
