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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import { cn } from "@/lib/utils";
import { formatVehicleCountLabel } from "../utils/favorites.utils";
import { Card, CardContent } from "@/components/ui/card";

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
  };

  const handleDelete = async () => {
    await onDelete(list.id);
    setDeleteOpen(false);
  };

  return (
    <>
      <Card
        size="sm"
        role="button"
        className={cn(
          "flex w-56 shrink-0 items-start justify-between transition-colors",
          isActive ? "border-blue-200 bg-blue-50" : "",
        )}
        onClick={() => onSelect(list.id)}
        >
        <CardContent className="flex justify-between flex-row w-full">
          
            <div
              className={cn(
                "rounded-lg p-2",
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-50 text-gray-400",
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

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Opciones de ${list.name}`}
                  className="text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal className="size-5" aria-hidden />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => {
                  setRenameValue(list.name);
                  setRenameOpen(true);
                }}
              >
                <Pencil className="size-4" aria-hidden />
                Renombrar
              </DropdownMenuItem>
              {!list.is_default && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4" aria-hidden />
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

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
              Se eliminará la carpeta {list.name}. Los vehículos seguirán en
              otras listas donde estén guardados.
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
