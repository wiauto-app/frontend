"use client";

import { useState } from "react";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);

  const handleRemove = async () => {
    await onRemove();
    setMenuOpen(false);
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Más acciones"
            disabled={disabled}
            className="rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-700"
          >
            <MoreVertical className="size-4" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-52 p-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
            onClick={handleRemove}
          >
            <Trash2 className="size-4" aria-hidden />
            Quitar de favoritos
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setMoveDialogOpen(true);
              setMenuOpen(false);
            }}
          >
            <MoveRight className="size-4" aria-hidden />
            Mover a otra lista
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setCopyDialogOpen(true);
              setMenuOpen(false);
            }}
          >
            <Copy className="size-4" aria-hidden />
            Copiar a otra lista
          </Button>
        </PopoverContent>
      </Popover>

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
