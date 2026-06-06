"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import { cn } from "@/lib/utils";

type MoveCopyVehicleListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "move" | "copy";
  lists: VehicleList[];
  currentListId: string;
  vehicleId: string;
  onConfirm: (targetListId: string) => Promise<void>;
};

export const MoveCopyVehicleListDialog = ({
  open,
  onOpenChange,
  mode,
  lists,
  currentListId,
  onConfirm,
}: MoveCopyVehicleListDialogProps) => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableLists = useMemo(
    () =>
      mode === "move"
        ? lists.filter((list) => list.id !== currentListId)
        : lists,
    [lists, currentListId, mode],
  );

  useEffect(() => {
    if (!open) {
      setSelectedListId(null);
      setIsSubmitting(false);
      return;
    }

    if (availableLists.length > 0) {
      setSelectedListId(availableLists[0]?.id ?? null);
    }
  }, [open, availableLists]);

  const handleConfirm = async () => {
    if (!selectedListId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedListId);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "move" ? "Mover a otra lista" : "Copiar a otra lista";
  const description =
    mode === "move"
      ? "Selecciona la carpeta destino. El vehículo se quitará de la lista actual."
      : "Selecciona la carpeta donde quieres copiar este vehículo.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {!availableLists.length ? (
          <p className="py-4 text-sm text-gray-500">
            {mode === "move"
              ? "No hay otras carpetas disponibles para mover este vehículo."
              : "No hay carpetas disponibles."}
          </p>
        ) : (
          <ul className="max-h-60 space-y-2 overflow-y-auto" role="listbox" aria-label={title}>
            {availableLists.map((list) => {
              const isSelected = selectedListId === list.id;

              return (
                <li key={list.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelectedListId(list.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                      isSelected
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-gray-100 bg-white text-gray-700 hover:border-gray-200",
                    )}
                  >
                    <span className="font-medium">{list.name}</span>
                    {list.is_default && (
                      <span className="text-xs text-gray-500">Predeterminada</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedListId || isSubmitting || !availableLists.length}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : mode === "move" ? (
              "Mover"
            ) : (
              "Copiar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
