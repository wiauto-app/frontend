"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { useScheduleListingMutation } from "../hooks/useMyListingMutations";

interface ScheduleListingDialogProps {
  listing: OwnerVehicleListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const toLocalDateTimeInputValue = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
};

const getDefaultScheduleValue = (): string =>
  toLocalDateTimeInputValue(new Date(Date.now() + 24 * 60 * 60 * 1000));

export const ScheduleListingDialog = ({
  listing,
  open,
  onOpenChange,
}: ScheduleListingDialogProps) => {
  const [dateTimeValue, setDateTimeValue] = useState(getDefaultScheduleValue);
  const [minDateTimeValue, setMinDateTimeValue] = useState(
    getDefaultScheduleValue,
  );
  const scheduleMutation = useScheduleListingMutation();

  useEffect(() => {
    if (!open) {
      return;
    }

    setDateTimeValue(getDefaultScheduleValue());
    setMinDateTimeValue(toLocalDateTimeInputValue(new Date()));
  }, [open]);

  const handleSubmit = async () => {
    if (!listing || !dateTimeValue) {
      return;
    }

    try {
      await scheduleMutation.mutateAsync({
        id: listing.id,
        scheduled_publish_at: new Date(dateTimeValue).toISOString(),
      });
      toast.success("Publicación programada correctamente");
      onOpenChange(false);
    } catch {
      toast.error("No se pudo programar el anuncio");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (scheduleMutation.isPending) {
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar publicación</DialogTitle>
          <DialogDescription>
            El anuncio quedará oculto hasta la fecha seleccionada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="scheduled_publish_at">Fecha y hora</Label>
          <Input
            id="scheduled_publish_at"
            type="datetime-local"
            value={dateTimeValue}
            onChange={(event) => setDateTimeValue(event.target.value)}
            min={minDateTimeValue}
            disabled={scheduleMutation.isPending}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={scheduleMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={scheduleMutation.isPending || !listing}
          >
            {scheduleMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Programando…
              </>
            ) : (
              "Programar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
