"use client";

import { useState } from "react";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, MoveRight, Trash2 } from "lucide-react";
import { MoveCopyVehicleListDialog } from "./MoveCopyVehicleListDialog";

type FavoriteVehicleActionsMenuProps = {
  lists: VehicleList[];
  currentListId: string;
  vehicleId: string;
  onRemove: () => Promise<void>;
  onMove: (targetListId: string) => Promise<void>;
  onCopy: (targetListId: string) => Promise<void>;
  disabled?: boolean;
};

export const FavoriteVehicleActionsMenu = ({
  lists,
  currentListId,
  vehicleId,
  onRemove,
  onMove,
  onCopy,
  disabled = false,
}: FavoriteVehicleActionsMenuProps) => {
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);

  const handleRemove = async () => {
    await onRemove();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Más acciones"
              className="rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-700"
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem variant="destructive" onClick={handleRemove}>
            <Trash2 className="size-4" aria-hidden />
            Quitar de favoritos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMoveDialogOpen(true)}>
            <MoveRight className="size-4" aria-hidden />
            Mover a otra lista
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCopyDialogOpen(true)}>
            <Copy className="size-4" aria-hidden />
            Copiar a otra lista
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MoveCopyVehicleListDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        mode="move"
        lists={lists}
        currentListId={currentListId}
        vehicleId={vehicleId}
        onConfirm={onMove}
      />

      <MoveCopyVehicleListDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        mode="copy"
        lists={lists}
        currentListId={currentListId}
        vehicleId={vehicleId}
        onConfirm={onCopy}
      />
    </>
  );
};
