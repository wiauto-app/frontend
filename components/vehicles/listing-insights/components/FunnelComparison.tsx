import { Clock, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  FunnelTrend,
  ListingFunnel,
} from "@/interfaces/vehicle-insights.interface";
import {
  formatDecimal,
  FUNNEL_METRIC_LABEL,
  FUNNEL_TREND_CLASS,
  FUNNEL_TREND_LABEL,
} from "../utils/listing-insights-format";

interface FunnelComparisonProps {
  funnel: ListingFunnel;
}

const TREND_ICON: Record<FunnelTrend, typeof TrendingUp> = {
  above: TrendingUp,
  on_par: Minus,
  below: TrendingDown,
};

export const FunnelComparison = ({ funnel }: FunnelComparisonProps) => {
  return (
    <Card size="sm">
      <CardContent className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Rendimiento frente a similares
          </h2>
          {funnel.available && funnel.segment ? (
            <p className="text-xs text-muted-foreground">
              Media diaria de los últimos {funnel.window_days} días vs.{" "}
              {funnel.segment.sample_count} anuncios de {funnel.segment.scope_label}
            </p>
          ) : null}
        </div>

        {!funnel.available ? (
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Disponible a partir del día {funnel.min_age_days}. Tu anuncio lleva{" "}
              {funnel.listing_age_days}{" "}
              {funnel.listing_age_days === 1 ? "día" : "días"} publicado.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">
              Métricas diarias de tu anuncio comparadas con la mediana del segmento
            </caption>
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th scope="col" className="pb-2 font-medium">
                  Métrica
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Tú / día
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Similares
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  <span className="sr-only">Tendencia</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {funnel.metrics.map((metric) => {
                const TrendIcon = metric.trend ? TREND_ICON[metric.trend] : null;
                return (
                  <tr key={metric.key}>
                    <th
                      scope="row"
                      className="py-2 text-left font-normal text-foreground"
                    >
                      {FUNNEL_METRIC_LABEL[metric.key]}
                      <span className="block text-[11px] text-muted-foreground">
                        {metric.count} en total
                      </span>
                    </th>
                    <td className="py-2 text-right font-semibold tabular-nums text-foreground">
                      {formatDecimal(metric.daily_rate)}
                    </td>
                    <td className="py-2 text-right tabular-nums text-muted-foreground">
                      {metric.segment_daily_rate !== null
                        ? formatDecimal(metric.segment_daily_rate)
                        : "—"}
                    </td>
                    <td className="py-2 pl-2 text-right">
                      {metric.trend && TrendIcon ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-xs font-medium",
                            FUNNEL_TREND_CLASS[metric.trend],
                          )}
                        >
                          <TrendIcon className="size-3.5" aria-hidden />
                          <span className="hidden sm:inline">
                            {FUNNEL_TREND_LABEL[metric.trend]}
                          </span>
                          <span className="sr-only sm:hidden">
                            {FUNNEL_TREND_LABEL[metric.trend]}
                          </span>
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
