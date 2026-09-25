import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceEur } from "../utils/listing-insights-format";

interface PriceInsightEmptyProps {
  price: number;
}

export const PriceInsightEmpty = ({ price }: PriceInsightEmptyProps) => {
  return (
    <Card size="sm">
      <CardContent className="flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
          aria-hidden
        >
          <BarChart3 className="size-4" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground">
            Precio frente al mercado
          </h2>
          <p className="text-sm text-muted-foreground">
            Todavía no hay suficientes anuncios similares para comparar tu
            precio de {formatPriceEur(price)}. Volveremos a calcularlo cuando
            haya más datos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
