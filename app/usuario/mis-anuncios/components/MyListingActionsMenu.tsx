"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  CalendarClock,
  Copy,
  FileText,
  Loader2,
  MoreVertical,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
import {
  useRemoveListingMutation,
  useUpdateListingStatusMutation,
} from "../hooks/useMyListingMutations";
import { ScheduleListingDialog } from "./ScheduleListingDialog";

interface MyListingActionsMenuProps {
  listing: OwnerVehicleListItem;
}

export const MyListingActionsMenu = ({
  listing,
}: MyListingActionsMenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const removeMutation = useRemoveListingMutation();
  const updateStatusMutation = useUpdateListingStatusMutation();

  const isMutating =
    removeMutation.isPending || updateStatusMutation.isPending;

  const handleToggleStatus = async (nextStatus: VehicleStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: listing.id,
        status: nextStatus,
      });
    } catch {
      toast.error("No se pudo cambiar el estado del anuncio");
    }
  };

  const handleConfirmRemove = async () => {
    try {
      await removeMutation.mutateAsync(listing.id);
      setDeleteDialogOpen(false);
      toast.success("Anuncio eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el anuncio");
    }
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
          disabled={isMutating}
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
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
            <DropdownMenuItem onClick={() => setScheduleDialogOpen(true)}>
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
            <DropdownMenuItem onClick={() => void handleToggleStatus("sold")}>
              <Copy className="size-4" aria-hidden />
              Marcar como vendido
            </DropdownMenuItem>
          ) : null}
          {!isArchived ? (
            <DropdownMenuItem
              onClick={() => void handleToggleStatus("archived")}
            >
              <Archive className="size-4" aria-hidden />
              Archivar
            </DropdownMenuItem>
          ) : null}
          {!isActive && !canToggleStatus ? (
            <DropdownMenuItem onClick={() => void handleToggleStatus("active")}>
              <Power className="size-4" aria-hidden />
              Activar
            </DropdownMenuItem>
          ) : null}
          {canToggleStatus ? (
            <DropdownMenuItem
              onClick={() =>
                void handleToggleStatus(
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

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (removeMutation.isPending) {
            return;
          }
          setDeleteDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar anuncio</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar
              &quot;{listing.display_name}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={removeMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmRemove();
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {removeMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Eliminando…
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScheduleListingDialog
        listing={listing}
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
      />
    </>
  );
};
