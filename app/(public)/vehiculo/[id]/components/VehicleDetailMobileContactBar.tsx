"use client";

import { useState, type ReactNode } from "react";
import { Loader2, MessageCircle, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useVehicleContactDialogs } from "../hooks/useVehicleContactDialogs";
import { VehicleContactDialogs } from "./VehicleContactDialogs";
import { VehicleDetailContactTabs } from "./VehicleDetailContactTabs";

interface VehicleDetailMobileContactBarProps {
  vehicleId: string;
  showPhone: boolean;
  hasWhatsApp: boolean;
  vehicleTitle: string;
  publisherProfileId: string;
}

interface ContactBarButtonProps {
  onClick: () => void;
  ariaLabel: string;
  label: string;
  disabled?: boolean;
  isLoading?: boolean;
  icon: ReactNode;
  accent?: "default" | "call" | "whatsapp" | "message";
}

const ContactBarButton = ({
  onClick,
  ariaLabel,
  label,
  disabled = false,
  isLoading = false,
  icon,
  accent = "default",
}: ContactBarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isLoading}
    aria-label={ariaLabel}
    className={cn(
      "flex min-w-0 flex-1  items-center justify-center gap-1 rounded-xl px-2 py-2.5 transition-colors",
      "text-xs font-medium text-muted-foreground",
      "hover:bg-muted/80 hover:text-foreground",
      "active:scale-[0.97]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-45",
      accent === "call" &&
        "bg-green-600 text-white hover:bg-green-700 hover:text-white",
      accent === "whatsapp" &&
        "bg-green-600 text-white hover:bg-green-700 hover:text-white",
      accent === "message" &&
        "bg-primary/90 text-white hover:bg-primary hover:text-white",
    )}
  >
    {isLoading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : icon}
    <span className="truncate">{label}</span>
  </button>
);

export const VehicleDetailMobileContactBar = ({
  vehicleId,
  showPhone,
  hasWhatsApp,
  vehicleTitle,
  publisherProfileId,
}: VehicleDetailMobileContactBarProps) => {
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const {
    isLoadingPhone,
    isLoadingWhatsApp,
    handlePhoneClick,
    handleWhatsAppClick,
    dialogs,
  } = useVehicleContactDialogs({ vehicleId, vehicleTitle });

  const showWhatsApp = showPhone && hasWhatsApp;

  const handleOpenMessageSheet = () => {
    setIsMessageSheetOpen(true);
  };

  return (
    <>
      <div className="mx-auto">
        <div
          className="flex items-stretch gap-1"
          role="toolbar"
          aria-label="Contactar al anunciante"
        >
          {showPhone ? (
            <ContactBarButton
              onClick={handlePhoneClick}
              ariaLabel="Llamar al anunciante"
              label="Llamar"
              disabled={isLoadingPhone}
              isLoading={isLoadingPhone}
              accent="call"
              icon={<Phone className="size-5" strokeWidth={2} aria-hidden />}
            />
          ) : null}

          {showWhatsApp ? (
            <ContactBarButton
              onClick={handleWhatsAppClick}
              ariaLabel="Contactar por WhatsApp"
              label="WhatsApp"
              disabled={isLoadingWhatsApp}
              isLoading={isLoadingWhatsApp}
              accent="whatsapp"
              icon={<FaWhatsapp className="size-5" aria-hidden />}
            />
          ) : null}

          <ContactBarButton
            onClick={handleOpenMessageSheet}
            ariaLabel="Enviar mensaje al anunciante"
            label="Mensaje"
            accent="message"
            icon={
              <MessageCircle className="size-5" strokeWidth={2} aria-hidden />
            }
          />
        </div>
      </div>

  

      <Sheet open={isMessageSheetOpen} onOpenChange={setIsMessageSheetOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
          aria-describedby={undefined}
        >
          <SheetHeader className="shrink-0 border-b border-border px-4 py-4 text-left">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
            <SheetTitle>Contactar al anunciante</SheetTitle>
            <SheetDescription>
              Escribe tu mensaje o solicita que te llamen.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            <VehicleDetailContactTabs
              vehicleId={vehicleId}
              publisherProfileId={publisherProfileId}
            />
          </div>
        </SheetContent>
      </Sheet>

      <VehicleContactDialogs
        phone={dialogs.phone}
        whatsapp={dialogs.whatsapp}
      />
    </>
  );
};
