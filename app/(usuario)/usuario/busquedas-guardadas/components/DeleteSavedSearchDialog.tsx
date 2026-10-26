"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteSavedSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchName: string;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
};

export const DeleteSavedSearchDialog = ({
  open,
  onOpenChange,
  searchName,
  onConfirm,
  isDeleting = false,
}: DeleteSavedSearchDialogProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar búsqueda guardada</DialogTitle>
          <DialogDescription>
            Se eliminará la búsqueda &quot;{searchName}&quot; y dejarás de
            recibir alertas asociadas. Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              void handleConfirm();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
