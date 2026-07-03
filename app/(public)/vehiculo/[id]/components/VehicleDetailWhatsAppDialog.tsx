"use client";

import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VehicleDetailWhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whatsappUrl: string;
  vehicleTitle: string;
}

export const VehicleDetailWhatsAppDialog = ({
  open,
  onOpenChange,
  whatsappUrl,
  vehicleTitle,
}: VehicleDetailWhatsAppDialogProps) => {
  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Contactar por WhatsApp</DialogTitle>
          <DialogDescription>
            Se abrirá una conversación con el anunciante sobre{" "}
            <span className="font-medium text-gray-900">{vehicleTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          className="w-full gap-2 bg-green-600 hover:bg-green-700"
          onClick={handleOpenWhatsApp}
          aria-label="Abrir conversación en WhatsApp"
        >
          <MessageCircle className="size-4" aria-hidden />
          Abrir conversación
        </Button>
      </DialogContent>
    </Dialog>
  );
};
