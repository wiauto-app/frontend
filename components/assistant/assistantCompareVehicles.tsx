"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CompareVehiclesOutput } from "./types/assistant-tool-outputs";
import { useAssistantChat } from "./assistantChatProvider";

interface AssistantCompareVehiclesProps {
  output: CompareVehiclesOutput;
}

const formatCriterionValue = (value: string | number | null | undefined): string => {
  if (value == null || value === "") {
    return "—";
  }

  return String(value);
};

export const AssistantCompareVehicles = ({
  output,
}: AssistantCompareVehiclesProps) => {
  const { sendMessage, ensureConversationId, status } = useAssistantChat();
  const isBusy = status === "submitted" || status === "streaming";

  const handleSelectVehicle = async (vehicleId: string, title: string) => {
    if (isBusy) {
      return;
    }

    await ensureConversationId();
    sendMessage({
      text: `Analiza en detalle el anuncio del vehículo ${vehicleId} (${title}). Ya lo elegí; no busques otros vehículos.`,
    });
  };

  return (
    <div className="flex w-full flex-col gap-3 overflow-x-auto rounded-xl border border-border bg-muted/20 p-3">
      {output.highlights.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {output.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}

      <div className="min-w-160">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-2 font-medium text-muted-foreground">Criterio</th>
              {output.vehicles.map((vehicle) => (
                <th key={vehicle.id} className="p-2 font-medium">
                  <Link
                    href={`/vehiculo/${vehicle.id}`}
                    className="text-primary hover:underline"
                  >
                    {vehicle.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.criteria.map((criterion) => (
              <tr key={criterion.key} className="border-b border-border/70">
                <td className="p-2 text-muted-foreground">{criterion.label}</td>
                {output.vehicles.map((vehicle) => (
                  <td key={`${vehicle.id}-${criterion.key}`} className="p-2">
                    {formatCriterionValue(criterion.values[vehicle.id])}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-2 text-muted-foreground">Acción</td>
              {output.vehicles.map((vehicle) => (
                <td key={`${vehicle.id}-action`} className="p-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={isBusy}
                    aria-label={`Elegir este vehículo: ${vehicle.title}`}
                    onClick={() => {
                      void handleSelectVehicle(vehicle.id, vehicle.title);
                    }}
                  >
                    Elegir este vehículo
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
