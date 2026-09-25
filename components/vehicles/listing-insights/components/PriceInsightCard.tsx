"use client";

import { useState } from "react";
import { Info, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { VehiclePriceInsight } from "@/interfaces/vehicle-insights.interface";
import { useApplySuggestedPrice } from "../hooks/useApplySuggestedPrice";
import {
  CONFIDENCE_LABEL,
  formatPriceEur,
  formatSignedPercent,
  PRICE_VERDICT_BADGE_CLASS,
  PRICE_VERDICT_LABEL,
} from "../utils/listing-insights-format";
import { PriceRangeBar } from "./PriceRangeBar";
import { PriceInsightEmpty } from "./PriceInsightEmpty";

export const PRICE_INSIGHT_ANCHOR_ID = "precio-mercado";

interface PriceInsightCardProps {
  vehicleId: string;
  price: VehiclePriceInsight;
}

export const PriceInsightCard = ({ vehicleId, price }: PriceInsightCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const applySuggestedPrice = useApplySuggestedPrice();

  if (!price.market) {
    return (
      <div id={PRICE_INSIGHT_ANCHOR_ID} className="scroll-mt-24">
        <PriceInsightEmpty price={price.price} />
      </div>
    );
  }

  const { market, verdict, suggested_price: suggestedPrice } = price;
  const isPending = applySuggestedPrice.isPending;

  const handleConfirm = async () => {
    if (suggestedPrice === null) {
      return;
    }
    try {
      await applySuggestedPrice.mutateAsync({
        vehicleId,
        price: suggestedPrice,
      });
      setConfirmOpen(false);
    } catch {
      // El toast de error lo emite el hook.
    }
  };

  return (
    <Card id={PRICE_INSIGHT_ANCHOR_ID} size="sm" className="scroll-mt-24">
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">
              Precio frente al mercado
            </h2>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {formatPriceEur(price.price)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {verdict ? (
              <Badge
                variant="outline"
                className={cn("h-auto py-1", PRICE_VERDICT_BADGE_CLASS[verdict])}
              >
                {PRICE_VERDICT_LABEL[verdict]}
              </Badge>
            ) : null}
            {price.deviation_percent !== null ? (
              <span className="text-xs text-muted-foreground">
                {formatSignedPercent(price.deviation_percent)} vs. mediana
              </span>
            ) : null}
          </div>
        </div>

        {price.position_percent !== null ? (
          <PriceRangeBar
            market={market}
            price={price.price}
            positionPercent={price.position_percent}
            verdict={verdict}
          />
        ) : null}

        {price.summary ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {price.summary}
          </p>
        ) : null}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>
            {market.sample_count} anuncios comparables · {market.scope_label}
          </span>
          {price.confidence ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-sm underline decoration-dotted underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                }
              >
                <Info className="size-3.5" aria-hidden />
                {CONFIDENCE_LABEL[price.confidence]}
              </TooltipTrigger>
              <TooltipContent>
                Basado en {market.sample_count} anuncios activos
                {market.tier === 2 ? " de la misma marca" : " del mismo modelo"}.
                Cuantos más anuncios similares, más fiable es la comparación.
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>

        {suggestedPrice !== null ? (
          <>
            <Button
              type="button"
              className="w-full"
              disabled={isPending}
              onClick={() => setConfirmOpen(true)}
            >
              {isPending ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Sparkles aria-hidden />
              )}
              Usar precio sugerido · {formatPriceEur(suggestedPrice)}
            </Button>

            <AlertDialog
              open={confirmOpen}
              onOpenChange={(open) => {
                if (!isPending) {
                  setConfirmOpen(open);
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cambiar el precio del anuncio</AlertDialogTitle>
                  <AlertDialogDescription>
                    El precio pasará de {formatPriceEur(price.price)} a{" "}
                    {formatPriceEur(suggestedPrice)}. El cambio se publica al
                    momento.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isPending}
                    onClick={(event) => {
                      event.preventDefault();
                      void handleConfirm();
                    }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Actualizando…
                      </>
                    ) : (
                      `Usar ${formatPriceEur(suggestedPrice)}`
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};
