"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

import { VehicleShareDialog } from "./VehicleShareDialog";

type VehicleShareButtonProps = {
  vehicleId: string;
  vehicleTitle: string;
};

export const VehicleShareButton = ({
  vehicleId,
  vehicleTitle,
}: VehicleShareButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
        aria-label="Compartir vehículo"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <Share2 className="size-4" aria-hidden />
      </button>

      <VehicleShareDialog
        open={open}
        onOpenChange={setOpen}
        vehicleId={vehicleId}
        vehicleTitle={vehicleTitle}
      />
    </>
  );
};
