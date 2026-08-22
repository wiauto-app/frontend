"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  CalendarClock,
  Copy,
  FileText,
  FormInput,
  MoreVertical,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";

interface MyListingActionsMenuProps {
  listing: OwnerVehicleListItem;
  onDuplicate: (id: string) => Promise<void>;
  onSchedule: (listing: OwnerVehicleListItem) => void;
  onRemove: (id: string) => Promise<void>;
  onToggleStatus: (id: string, nextStatus: VehicleStatus) => Promise<void>;
  canUseAdvancedEditor?: boolean;
  disabled?: boolean;
}

export const MyListingActionsMenu = ({
  listing,
  onDuplicate,
  onSchedule,
  onRemove,
  onToggleStatus,
  canUseAdvancedEditor = false,
  disabled = false,
}: MyListingActionsMenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDuplicate = async () => {
    await onDuplicate(listing.id);
  };

  const handleSchedule = () => {
    onSchedule(listing);
  };

  const handleToggleStatus = async (nextStatus: VehicleStatus) => {
    await onToggleStatus(listing.id, nextStatus);
  };

  const handleRemove = async () => {
    await onRemove(listing.id);
    setDeleteDialogOpen(false);
  };

  const canToggleStatus =
    listing.status === "active" ||
    (listing.status === "inactive" && !listing.scheduled_publish_at);
  const isActive = listing.status === "active";
  const isSold = listing.status === "sold";
  const isArchived = listing.status === "archived";
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
              aria-label="Más acciones del anuncio"
              className="text-blue-500 hover:bg-blue-50"
            >
              <MoreVertical className="w-5 h-5" aria-hidden />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            render={<Link href={`/editar-vehiculo/${listing.id}`} />}
          >
            <Pencil className="size-4" aria-hidden />
            Editar
          </DropdownMenuItem>
          {/* {canUseAdvancedEditor ? (
            <DropdownMenuItem
              render={
                <Link href={`/editar-vehiculo-profesional/${listing.id}`} />
              }
            >
              <FormInput className="size-4" aria-hidden />
              Edición completa
            </DropdownMenuItem>
          ) : null} */}
          {/* <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="size-4" aria-hidden />
            Duplicar
          </DropdownMenuItem> */}
          <DropdownMenuItem
            render={
              <Link
                href={`/usuario/mis-anuncios/${listing.id}/informe`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <FileText className="size-4" aria-hidden />
            Exportar informe
          </DropdownMenuItem>
          {listing.can_schedule ? (
            <DropdownMenuItem onClick={handleSchedule}>
              <CalendarClock className="size-4" aria-hidden />
              Programar
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" aria-hidden />
            Eliminar
          </DropdownMenuItem>
          {!isSold ? (
            <DropdownMenuItem onClick={() => handleToggleStatus("sold")}>
              <Copy className="size-4" aria-hidden />
              Marcar como vendido
            </DropdownMenuItem>
          ) : null}
          {!isArchived ? (
            <DropdownMenuItem onClick={() => handleToggleStatus("archived")}>
              <Archive className="size-4" aria-hidden />
              Archivar
            </DropdownMenuItem>
          ) : null}
          {!isActive ? (
            <DropdownMenuItem onClick={() => handleToggleStatus("active")}>
              <Power className="size-4" aria-hidden />
              Activar
            </DropdownMenuItem>
          ) : null}
          {canToggleStatus ? (
            <DropdownMenuItem
              onClick={() =>
                handleToggleStatus(
                  listing.status === "active" ? "inactive" : "active",
                )
              }
            >
              <Power className="size-4" aria-hidden />
              {listing.status === "active" ? "Inactivar" : "Activar"}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar anuncio</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar
              &quot;{listing.display_name}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleRemove}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
