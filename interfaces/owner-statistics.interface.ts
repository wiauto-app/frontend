export type OwnerStatisticsGranularity = "day" | "week" | "month";

export interface OwnerStatisticsPeriod {
  since: string;
  until: string;
  granularity: OwnerStatisticsGranularity;
}

export interface OwnerStatisticsReach {
  listings_published: number;
  impressions: number;
  visits: number;
  contacts: number;
}

export interface OwnerStatisticsActions {
  favorites: number;
  shares: number;
  response_rate_percent: number | null;
  median_response_time_minutes: number | null;
}

export interface OwnerStatisticsTimeSeriesBucket {
  bucket_start: string;
  impressions: number;
  visits: number;
  messages: number;
  listings_published: number;
}

export interface OwnerStatisticsResponse {
  period: OwnerStatisticsPeriod;
  reach: OwnerStatisticsReach;
  actions: OwnerStatisticsActions;
  time_series: OwnerStatisticsTimeSeriesBucket[];
}
