"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AnalyzeChecklistStatus,
  AnalyzeListingOutput,
} from "./types/assistant-tool-outputs";
import { getAnalyzeRiskLabel } from "./types/assistant-tool-outputs";
import { useAssistantChat } from "./assistantChatProvider";

interface AssistantAnalyzeListingProps {
  output: AnalyzeListingOutput;
}

const statusIcon = (status?: AnalyzeChecklistStatus) => {
  switch (status) {
    case "ok":
      return <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />;
    case "warning":
    case "warn":
      return <AlertTriangle className="size-4 text-amber-600" aria-hidden />;
    case "fail":
    case "missing":
      return <XCircle className="size-4 text-destructive" aria-hidden />;
    default:
      return <HelpCircle className="size-4 text-muted-foreground" aria-hidden />;
  }
};

export const AssistantAnalyzeListing = ({
  output,
}: AssistantAnalyzeListingProps) => {
  const { sendMessage, ensureConversationId, status } = useAssistantChat();
  const isBusy = status === "submitted" || status === "streaming";
  const isRecommended = output.verdict === "recomendable";
  const hasRef = typeof output.ref === "number";
  const canContact = hasRef || Boolean(output.vehicle_id);

  const handleContactSeller = async () => {
    if (isBusy || !canContact) {
      return;
    }

    await ensureConversationId();

    if (hasRef) {
      sendMessage({
        text: `Prepara el contacto del vendedor del anuncio Ref. ${output.ref} con prepareSellerContact (vehicle_ref=${output.ref}). No busques otros vehículos.`,
      });
      return;
    }

    sendMessage({
      text: `Prepara el contacto del vendedor del vehículo ${output.vehicle_id} con prepareSellerContact (vehicle_id=${output.vehicle_id}). No busques otros vehículos.`,
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {hasRef ? (
          <Badge variant="secondary" aria-label={`Referencia ${output.ref}`}>
            Ref. {output.ref}
          </Badge>
        ) : null}
        <Badge
          variant={isRecommended ? "default" : "destructive"}
          aria-label={`Veredicto: ${output.verdict}`}
        >
          {isRecommended ? "Recomendable" : "Riesgosa"}
        </Badge>
        <p className="text-sm text-foreground">{output.summary}</p>
      </div>

      {output.checklist.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Checklist del anuncio</h3>
          <ul className="flex flex-col gap-2">
            {output.checklist.map((item, index) => (
              <li
                key={item.id ?? `${item.label}-${index}`}
                className="flex items-start gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm"
              >
                {statusIcon(item.status)}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.label}</p>
                  {item.detail ? (
                    <p className="text-muted-foreground">{item.detail}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {output.risks.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-destructive">Riesgos</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {output.risks.map((risk, index) => {
              const label = getAnalyzeRiskLabel(risk);
              return (
                <li
                  key={`${label}-${index}`}
                  className={cn("marker:text-destructive")}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <Button
        type="button"
        className="w-full gap-1.5 sm:w-auto"
        disabled={isBusy || !canContact}
        aria-label="Contactar al vendedor de este vehículo"
        onClick={() => {
          void handleContactSeller();
        }}
      >
        <MessageCircle className="size-4" aria-hidden />
        Contactar al vendedor
      </Button>
    </div>
  );
};
