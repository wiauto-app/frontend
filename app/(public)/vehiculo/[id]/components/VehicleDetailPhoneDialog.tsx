"use client";

import { Copy, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VehicleDetailPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneCode: string;
  phone: string;
}

const formatDisplayPhone = (phoneCode: string, phone: string): string =>
  phoneCode ? `${phoneCode} ${phone}` : phone;

const buildTelHref = (phoneCode: string, phone: string): string => {
  const digits = `${phoneCode}${phone}`.replace(/\D/g, "");
  return `tel:+${digits.replace(/^\+/, "")}`;
};

export const VehicleDetailPhoneDialog = ({
  open,
  onOpenChange,
  phoneCode,
  phone,
}: VehicleDetailPhoneDialogProps) => {
  const displayPhone = formatDisplayPhone(phoneCode, phone);
  const telHref = buildTelHref(phoneCode, phone);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayPhone);
      toast.success("Número copiado");
    } catch {
      toast.error("No se pudo copiar el número");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Teléfono del anunciante</DialogTitle>
          <DialogDescription>
            Puedes llamar directamente o copiar el número para contactar más
            tarde.
          </DialogDescription>
        </DialogHeader>

        <p
          className="text-center text-2xl font-semibold tracking-wide text-gray-900"
          aria-live="polite"
        >
          {displayPhone}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={telHref}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1 gap-2")}
            aria-label={`Llamar al ${displayPhone}`}
          >
            <Phone className="size-4" aria-hidden />
            Llamar
          </a>
          <Button
            type="button"
            variant="secondary"
            className="flex-1 gap-2"
            onClick={() => {
              void handleCopy();
            }}
            aria-label="Copiar número de teléfono"
          >
            <Copy className="size-4" aria-hidden />
            Copiar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
