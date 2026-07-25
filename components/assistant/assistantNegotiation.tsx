"use client";

import type { PrepareNegotiationOutput } from "./types/assistant-tool-outputs";

interface AssistantNegotiationProps {
  output: PrepareNegotiationOutput;
}

const formatOffer = (min: number, max: number, currency?: string): string => {
  const formatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  });

  return `${formatter.format(min)} – ${formatter.format(max)}`;
};

export const AssistantNegotiation = ({
  output,
}: AssistantNegotiationProps) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Puntos para negociar</h3>
        {output.talking_points.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {output.talking_points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay puntos de negociación disponibles.
          </p>
        )}
      </div>

      {output.offer_range ? (
        <div className="rounded-lg border border-border bg-background px-3 py-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Rango de oferta sugerido
          </p>
          <p className="text-base font-semibold text-foreground">
            {formatOffer(
              output.offer_range.min,
              output.offer_range.max,
              output.offer_range.currency,
            )}
          </p>
        </div>
      ) : null}

      {output.caveats && output.caveats.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Precauciones</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {output.caveats.map((caveat) => (
              <li key={caveat}>{caveat}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
