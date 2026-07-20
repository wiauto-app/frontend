"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type {
  OwnerDashboardGranularity,
  OwnerDashboardTimeSeriesPoint,
} from "@/interfaces/owner-dashboard.interface";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  formatBucketDate,
  formatNumber,
  getViewsChartSubtitle,
} from "./dashboard.utils";

interface DashboardViewsChartProps {
  data: OwnerDashboardTimeSeriesPoint[];
  granularity: OwnerDashboardGranularity;
}

const chartConfig = {
  count: {
    label: "Vistas",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const DashboardViewsChart = ({
  data,
  granularity,
}: DashboardViewsChartProps) => {
  const chartData = data.map((point) => ({
    ...point,
    label: formatBucketDate(point.bucket_start, granularity),
  }));

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Vistas de tus anuncios
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {getViewsChartSubtitle(granularity)}
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-56 text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg">
          Aún no hay vistas registradas en este período.
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-[16/7] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              tickFormatter={(value) => formatNumber(Number(value))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    const firstItem = Array.isArray(payload) ? payload[0] : undefined;
                    const bucketStart =
                      firstItem &&
                      typeof firstItem === "object" &&
                      "payload" in firstItem &&
                      firstItem.payload &&
                      typeof firstItem.payload === "object" &&
                      "bucket_start" in firstItem.payload
                        ? String(
                            (firstItem.payload as { bucket_start?: string })
                              .bucket_start ?? "",
                          )
                        : "";

                    return bucketStart
                      ? formatBucketDate(bucketStart, granularity)
                      : "";
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              fill="url(#viewsFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </section>
  );
};
