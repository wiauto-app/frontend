"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { openVehicleContactChat } from "@/lib/chat/openVehicleContactChat";
import { FavoriteVehicleActionsMenu } from "./FavoriteVehicleActionsMenu";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";

interface FavoriteVehicleActionsProps {
  lists: VehicleList[];
  currentListId: string;
  itemCounts: Record<string, number>;
  vehicleId: string;
  publisherId: string;
  onRemove: () => Promise<void>;
  onMove: (targetListId: string) => Promise<void>;
  onCopy: (targetListId: string) => Promise<void>;
  disabled?: boolean;
}

export const FavoriteVehicleActions = ({
  lists,
  currentListId,
  itemCounts,
  vehicleId,
  publisherId,
  onRemove,
  onMove,
  onCopy,
  disabled = false,
}: FavoriteVehicleActionsProps) => {
  const router = useRouter();
  const [isContacting, setIsContacting] = useState(false);

  const handleContact = async () => {
    if (!publisherId) {
      toast.error("No se encontró el vendedor del vehículo");
      return;
    }

    setIsContacting(true);
    try {
      const { chat_id } = await openVehicleContactChat({
        vehicleId,
        publisherId,
      });
      toast.success("Chat iniciado correctamente");
      router.push(`/usuario/mensajes?chat_id=${chat_id}`);
    } catch {
      toast.error("No se pudo iniciar el chat");
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
      <Button
        type="button"
        className="w-full sm:min-w-32"
        onClick={handleContact}
        disabled={disabled || isContacting}
      >
        {isContacting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Contactar"
        )}
      </Button>

      <FavoriteVehicleActionsMenu
        lists={lists}
        currentListId={currentListId}
        itemCounts={itemCounts}
        vehicleId={vehicleId}
        onRemove={onRemove}
        onMove={onMove}
        onCopy={onCopy}
        disabled={disabled || isContacting}
      />
    </div>
  );
};
