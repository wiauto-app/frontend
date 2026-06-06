"use client";

import { Folder, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import { cn } from "@/lib/utils";
import { formatVehicleCountLabel } from "../utils/favorites.utils";

type FavoritesFolderCardProps = {
  list: VehicleList;
  itemCount: number;
  isActive: boolean;
  onSelect: (listId: string) => void;
  onRename: (listId: string, name: string) => Promise<void>;
  onDelete: (listId: string) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
};

export const FavoritesFolderCard = ({
  list,
  itemCount,
  isActive,
  onSelect,
  onRename,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: FavoritesFolderCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(list.name);

  const handleRename = async () => {
    const trimmedName = renameValue.trim();
    if (!trimmedName || trimmedName === list.name) {
      setRenameOpen(false);
      return;
    }

    await onRename(list.id, trimmedName);
    setRenameOpen(false);
    setMenuOpen(false);
  };

  const handleDelete = async () => {
    await onDelete(list.id);
    setDeleteOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "flex w-56 shrink-0 items-start justify-between rounded-xl border p-4 transition-colors",
          isActive
            ? "border-blue-200 bg-blue-50"
            : "border-gray-100 bg-white shadow-sm hover:border-gray-200",
        )}
      >
        <button
          type="button"
          onClick={() => onSelect(list.id)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
          aria-pressed={isActive}
          aria-label={`Seleccionar carpeta ${list.name}`}
        >
          <div
            className={cn(
              "rounded-lg p-2",
              isActive ? "bg-blue-100 text-blue-600" : "bg-gray-50 text-gray-400",
            )}
          >
            <Folder className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3
              className={cn(
                "truncate text-sm font-semibold",
                isActive ? "text-gray-900" : "text-gray-700",
              )}
            >
              {list.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {formatVehicleCountLabel(itemCount)}
            </p>
          </div>
        </button>

        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger
            type="button"
            aria-label={`Opciones de ${list.name}`}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal className="size-5" aria-hidden />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setRenameValue(list.name);
                setRenameOpen(true);
              }}
            >
              <Pencil className="size-4" aria-hidden />
              Renombrar
            </button>
            {!list.is_default && (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" aria-hidden />
                Eliminar
              </button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Renombrar carpeta</DialogTitle>
            <DialogDescription>
              Elige un nuevo nombre para la carpeta {list.name}.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            aria-label="Nuevo nombre de carpeta"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleRename} disabled={isUpdating}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar carpeta</DialogTitle>
            <DialogDescription>
              Se eliminará la carpeta {list.name}. Los vehículos seguirán en otras
              listas donde estén guardados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
