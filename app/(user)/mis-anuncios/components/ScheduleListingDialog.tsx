"use client";

import { useState } from "react";
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

type ScheduleListingDialogProps = {
  listing: OwnerVehicleListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (id: string, scheduled_publish_at: string) => Promise<void>;
  isSubmitting?: boolean;
};

const toLocalDateTimeInputValue = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
};

export const ScheduleListingDialog = ({
  listing,
  open,
  onOpenChange,
  onSchedule,
  isSubmitting = false,
}: ScheduleListingDialogProps) => {
  const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const [dateTimeValue, setDateTimeValue] = useState(
    toLocalDateTimeInputValue(defaultDate),
  );

  const handleSubmit = async () => {
    if (!listing || !dateTimeValue) {
      return;
    }

    const scheduled_at = new Date(dateTimeValue).toISOString();
    await onSchedule(listing.id, scheduled_at);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            min={toLocalDateTimeInputValue(new Date())}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !listing}
          >
            Programar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
