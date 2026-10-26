"use client";

import { useState } from "react";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, MoveRight, Trash2 } from "lucide-react";
import { MoveCopyVehicleListDialog } from "./MoveCopyVehicleListDialog";

interface FavoriteVehicleActionsMenuProps {
  lists: VehicleList[];
  currentListId: string;
  itemCounts: Record<string, number>;
  vehicleId: string;
  onRemove: () => Promise<void>;
  onMove: (targetListId: string) => Promise<void>;
  onCopy: (targetListId: string) => Promise<void>;
  disabled?: boolean;
}

export const FavoriteVehicleActionsMenu = ({
  lists,
  currentListId,
  itemCounts,
  vehicleId,
  onRemove,
  onMove,
  onCopy,
  disabled = false,
}: FavoriteVehicleActionsMenuProps) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleConfirmRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove();
      setRemoveDialogOpen(false);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Más acciones"
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setRemoveDialogOpen(true)}
          >
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

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar de favoritos?</AlertDialogTitle>
            <AlertDialogDescription>
              El vehículo se eliminará de esta carpeta. Podrás volver a guardarlo
              desde el anuncio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isRemoving ? "Quitando…" : "Quitar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MoveCopyVehicleListDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        mode="move"
        lists={lists}
        currentListId={currentListId}
        itemCounts={itemCounts}
        vehicleId={vehicleId}
        onConfirm={onMove}
      />

      <MoveCopyVehicleListDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        mode="copy"
        lists={lists}
        currentListId={currentListId}
        itemCounts={itemCounts}
        vehicleId={vehicleId}
        onConfirm={onCopy}
      />
    </>
  );
};
