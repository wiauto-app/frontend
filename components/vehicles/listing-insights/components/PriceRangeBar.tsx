import { cn } from "@/lib/utils";
import type {
  PriceVerdict,
  VehiclePriceMarket,
} from "@/interfaces/vehicle-insights.interface";
import {
  formatPriceEur,
  PRICE_VERDICT_LABEL,
  PRICE_VERDICT_MARKER_CLASS,
} from "../utils/listing-insights-format";

interface PriceRangeBarProps {
  market: VehiclePriceMarket;
  price: number;
  positionPercent: number;
  verdict: PriceVerdict | null;
}

const clampPercent = (value: number): number =>
  Math.min(100, Math.max(0, value));

/**
 * Misma escala que el backend: barra [p25 - IQR, p75 + IQR] con
 * IQR = max(p75 - p25, 3 % de la mediana).
 */
const buildScale = (market: VehiclePriceMarket) => {
  const iqr = Math.max(market.p75 - market.p25, market.median * 0.03);
  const min = market.p25 - iqr;
  const max = market.p75 + iqr;
  const span = max - min || 1;
  const toPercent = (value: number) => clampPercent(((value - min) / span) * 100);

  return {
    p25: toPercent(market.p25),
    median: toPercent(market.median),
    p75: toPercent(market.p75),
  };
};

export const PriceRangeBar = ({
  market,
  price,
  positionPercent,
  verdict,
}: PriceRangeBarProps) => {
  const scale = buildScale(market);
  const marker = clampPercent(positionPercent);
  const verdictLabel = verdict ? PRICE_VERDICT_LABEL[verdict] : "sin veredicto";

  const ariaLabel =
    `Tu precio ${formatPriceEur(price)} frente al mercado: ` +
    `rango habitual de ${formatPriceEur(market.p25)} a ${formatPriceEur(market.p75)}, ` +
    `mediana ${formatPriceEur(market.median)}. ${verdictLabel}.`;

  return (
    <div className="space-y-2">
      <div role="img" aria-label={ariaLabel} className="relative pt-7 pb-1">
        {/* Etiqueta del precio propio sobre el marcador */}
        <div
          className={cn(
            "absolute top-0 whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[11px] font-semibold text-background",
            // Evita que la etiqueta se salga del contenedor en los extremos.
            marker < 12
              ? "translate-x-0"
              : marker > 88
                ? "-translate-x-full"
                : "-translate-x-1/2",
          )}
          style={{ left: `${marker}%` }}
          aria-hidden
        >
          {formatPriceEur(price)}
        </div>

        <div className="relative h-2.5 rounded-full bg-muted" aria-hidden>
          {/* Banda P25–P75 */}
          <div
            className="absolute inset-y-0 rounded-full bg-emerald-200 dark:bg-emerald-900"
            style={{ left: `${scale.p25}%`, width: `${scale.p75 - scale.p25}%` }}
          />
          {/* Mediana */}
          <div
            className="absolute -inset-y-1 w-0.5 -translate-x-1/2 rounded-full bg-emerald-700 dark:bg-emerald-300"
            style={{ left: `${scale.median}%` }}
          />
          {/* Marcador del precio */}
          <div
            className={cn(
              "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-sm",
              verdict ? PRICE_VERDICT_MARKER_CLASS[verdict] : "bg-foreground",
            )}
            style={{ left: `${marker}%` }}
          />
        </div>
      </div>

      <div
        className="grid grid-cols-3 text-[11px] text-muted-foreground sm:text-xs"
        aria-hidden
      >
        <span>P25 · {formatPriceEur(market.p25)}</span>
        <span className="text-center font-medium text-foreground">
          Mediana · {formatPriceEur(market.median)}
        </span>
        <span className="text-right">P75 · {formatPriceEur(market.p75)}</span>
      </div>
    </div>
  );
};
