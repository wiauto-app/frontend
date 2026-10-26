"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import type {
  OwnerStatisticsGranularity,
  OwnerStatisticsTimeSeriesBucket,
} from "@/interfaces/owner-statistics.interface";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatBucketDate, formatNumber } from "../utils/estadisticas.utils";

interface EstadisticasChartProps {
  data: OwnerStatisticsTimeSeriesBucket[];
  granularity: OwnerStatisticsGranularity;
}

const chartConfig = {
  impressions: {
    label: "Impresiones",
    color: "#2563eb",
  },
  visits: {
    label: "Visitas",
    color: "#16a34a",
  },
  messages: {
    label: "Mensajes",
    color: "#f97316",
  },
  listings_published: {
    label: "Publicaciones",
    color: "#9333ea",
  },
} satisfies ChartConfig;

const SERIES_KEYS = [
  "impressions",
  "visits",
  "messages",
  "listings_published",
] as const;

export const EstadisticasChart = ({
  data,
  granularity,
}: EstadisticasChartProps) => {
  const chartData = data.map((point) => ({
    ...point,
    label: formatBucketDate(point.bucket_start, granularity),
  }));

  const hasData = data.some((point) =>
    SERIES_KEYS.some((key) => point[key] > 0),
  );

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Evolución de tus anuncios
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Impresiones, visitas, mensajes y publicaciones en el período
          seleccionado.
        </p>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-56 text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg">
          Aún no hay datos registrados en este período.
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-[16/7] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              {SERIES_KEYS.map((key) => (
                <linearGradient
                  key={key}
                  id={`estadisticasFill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              ))}
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
                    const firstItem = Array.isArray(payload)
                      ? payload[0]
                      : undefined;
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
            <Legend
              formatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label ?? value
              }
            />
            {SERIES_KEYS.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`var(--color-${key})`}
                fill={`url(#estadisticasFill-${key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      )}
    </section>
  );
};
