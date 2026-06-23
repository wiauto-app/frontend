export type OwnerDashboardPeriod = "7d" | "30d" | "90d";

export type OwnerDashboardMetric = {
  current: number;
  previous: number;
  change_percent: number | null;
};

export type OwnerDashboardTimeSeriesPoint = {
  bucket_start: string;
  count: number;
};

export type OwnerDashboardStockAgeBucket = {
  label: string;
  count: number;
  percentage: number;
};

export type OwnerDashboardQualityTier = "high" | "medium" | "low";

export type OwnerDashboardQualityDistributionItem = {
  tier: OwnerDashboardQualityTier;
  label: string;
  count: number;
};

export type OwnerDashboardPriceDeviationItem = {
  vehicle_id: string;
  display_name: string;
  price: number;
  benchmark_price: number;
  deviation_percent: number;
};

export type OwnerDashboardDealership = {
  name: string;
  phone_code: string | null;
  phone: string | null;
  rating: number | null;
  reviews_count: number;
};

export type OwnerDashboardSupport = {
  phone: string;
  faq_url: string;
};

export type OwnerDashboardResponse = {
  period: {
    days: number;
    start: string;
    end: string;
  };
  summary: {
    active_stock: OwnerDashboardMetric;
    views: OwnerDashboardMetric;
    leads: OwnerDashboardMetric;
    sales_value: OwnerDashboardMetric;
  };
  views_time_series: OwnerDashboardTimeSeriesPoint[];
  weekly_activity: {
    visits: number;
    messages_received: number;
  };
  opportunities: {
    unread_messages: number;
  };
  inventory: {
    active_count: number;
    stock_age_buckets: OwnerDashboardStockAgeBucket[];
    quality_distribution: OwnerDashboardQualityDistributionItem[];
    price_deviation: {
      above_market: OwnerDashboardPriceDeviationItem[];
      below_market: OwnerDashboardPriceDeviationItem[];
    };
  };
  dealership: OwnerDashboardDealership | null;
  support: OwnerDashboardSupport;
};
