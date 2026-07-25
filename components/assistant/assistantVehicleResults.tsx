"use client";

import { useState } from "react";
import { VehicleGridCard } from "@/app/(public)/vehiculos/components/VehicleGridCard";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getVehicleDisplayName } from "@/app/(public)/vehiculos/utils";
import { useAssistantChat } from "./assistantChatProvider";

interface AssistantVehicleResultsProps {
  total: number;
  vehicles: VehicleListItem[];
}

export const AssistantVehicleResults = ({
  total,
  vehicles,
}: AssistantVehicleResultsProps) => {
  const { sendMessage, ensureConversationId, status } = useAssistantChat();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasActed, setHasActed] = useState(false);

  const isBusy = status === "submitted" || status === "streaming";
  const canCompare = selectedIds.length >= 2 && selectedIds.length <= 4;

  if (vehicles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No se encontraron vehículos con esos criterios.
      </p>
    );
  }

  const handleToggleCompare = (vehicleId: string) => {
    if (hasActed || isBusy) {
      return;
    }

    setSelectedIds((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId);
      }

      if (prev.length >= 4) {
        return prev;
      }

      return [...prev, vehicleId];
    });
  };

  const handleLike = async (vehicle: VehicleListItem) => {
    if (hasActed || isBusy) {
      return;
    }

    const title = getVehicleDisplayName(vehicle);
    setHasActed(true);
    await ensureConversationId();
    sendMessage({
      text: `Analiza en detalle el anuncio del vehículo ${vehicle.id} (${title}). Ya lo elegí; no busques otros vehículos.`,
    });
  };

  const handleCompare = async () => {
    if (!canCompare || hasActed || isBusy) {
      return;
    }

    setHasActed(true);
    await ensureConversationId();
    sendMessage({
      text: `Compara lado a lado estos vehículos por sus ids (no busques de nuevo): ${selectedIds.join(", ")}.`,
    });
  };

  const handleNone = async () => {
    if (hasActed || isBusy) {
      return;
    }

    const seenIds = vehicles.map((vehicle) => vehicle.id);
    setHasActed(true);
    await ensureConversationId();
    sendMessage({
      text: `Ninguno me convence. Busca otras opciones y excluye estos ids: ${seenIds.join(", ")}.`,
    });
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <SearchCheck className="size-7 text-primary" aria-hidden />
          {total} resultado{total === 1 ? "" : "s"} encontrado
          {total === 1 ? "" : "s"}
          {total > vehicles.length ? ` (mostrando ${vehicles.length})` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!canCompare || hasActed || isBusy}
            aria-label={`Comparar ${selectedIds.length} vehículos seleccionados`}
            onClick={() => {
              void handleCompare();
            }}
          >
            Comparar{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={hasActed || isBusy}
            aria-label="Ninguno me gusta, seguir buscando"
            onClick={() => {
              void handleNone();
            }}
          >
            Ninguno / seguir buscando
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {vehicles.map((vehicle) => {
          const isSelected = selectedIds.includes(vehicle.id);
          const title = getVehicleDisplayName(vehicle);
          const compareDisabled =
            hasActed || isBusy || (!isSelected && selectedIds.length >= 4);

          return (
            <div
              key={vehicle.id}
              className={cn(
                "relative rounded-xl border-2 transition-colors",
                isSelected ? "border-primary" : "border-transparent",
              )}
            >
              <VehicleGridCard
                vehicle={vehicle}
                interactive
                footer={
                  <div className="flex w-full flex-col gap-2">
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-2 text-sm",
                        compareDisabled && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={compareDisabled}
                        aria-label={`Incluir ${title} en comparación`}
                        onCheckedChange={() => {
                          handleToggleCompare(vehicle.id);
                        }}
                      />
                      <span>Incluir en comparación</span>
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      disabled={hasActed || isBusy}
                      aria-label={`Elegir este vehículo: ${title}`}
                      onClick={() => {
                        void handleLike(vehicle);
                      }}
                    >
                      Elegir este vehículo
                    </Button>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>

      {selectedIds.length > 0 && selectedIds.length < 2 ? (
        <p className="text-xs text-muted-foreground">
          Selecciona al menos 2 vehículos para comparar (máximo 4).
        </p>
      ) : null}

      {total > vehicles.length && (
        <Link
          href="/vehiculos"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver más en el catálogo
        </Link>
      )}
    </div>
  );
};
