"use client";

import { useState } from "react";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
        <PopoverTrigger
          type="button"
          aria-label="Más acciones"
          disabled={disabled}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
        >
          <MoreVertical className="size-4" aria-hidden />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-52 p-2">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={handleRemove}
          >
            <Trash2 className="size-4" aria-hidden />
            Quitar de favoritos
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setMoveDialogOpen(true);
              setMenuOpen(false);
            }}
          >
            <MoveRight className="size-4" aria-hidden />
            Mover a otra lista
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setCopyDialogOpen(true);
              setMenuOpen(false);
            }}
          >
            <Copy className="size-4" aria-hidden />
            Copiar a otra lista
          </button>
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
