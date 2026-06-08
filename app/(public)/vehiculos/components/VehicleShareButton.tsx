"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

import { VehicleShareDialog } from "./VehicleShareDialog";
import { cn } from "@/lib/utils";

type VehicleShareButtonProps = {
  vehicleId: string;
  vehicleTitle: string;
  variant?: "ghost" | "outline";
};

export const VehicleShareButton = ({
  vehicleId,
  vehicleTitle,
  variant = "ghost",
}: VehicleShareButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="icon"
        variant={variant}
        className={cn("rounded-full text-muted-foreground hover:bg-muted hover:text-foreground", variant === "outline" && "border-2 border-muted-foreground/50 rounded-md")}
        aria-label="Compartir vehículo"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <Share2 className="size-4" aria-hidden />
      </Button>

      <VehicleShareDialog
        open={open}
        onOpenChange={setOpen}
        vehicleId={vehicleId}
        vehicleTitle={vehicleTitle}
      />
    </>
  );
};
