"use client";

import type { ReactNode } from "react";
import {
  Loader2,
  Mail,
  Phone,
  PhoneIncoming,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useVehicleContactDialogs } from "../hooks/useVehicleContactDialogs";
import { scrollToVehicleContactTab } from "../utils/vehicleContactTab.utils";
import { VehicleContactDialogs } from "./VehicleContactDialogs";

interface VehicleDetailMobileActionsProps {
  vehicleId: string;
  showPhone: boolean;
  hasWhatsApp: boolean;
  vehicleTitle: string;
}

interface MobileActionButtonProps {
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
  isLoading?: boolean;
  icon: ReactNode;
  loadingIcon?: ReactNode;
  accent?: "default" | "call" | "whatsapp";
}

const MobileActionButton = ({
  onClick,
  ariaLabel,
  disabled = false,
  isLoading = false,
  icon,
  loadingIcon,
  accent = "default",
}: MobileActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isLoading}
    aria-label={ariaLabel}
    className={cn(
      "flex flex-1 items-center justify-center rounded-xl py-3.5 transition-all",
      "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm",
      "active:scale-[0.97] active:bg-primary/10 active:text-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-45",
      accent === "call" &&
        "text-green-600 hover:bg-green-50 hover:text-green-700 active:bg-green-100 active:text-green-800",
      accent === "whatsapp" &&
        "text-green-600 hover:bg-green-50 hover:text-green-700 active:bg-green-100 active:text-green-800",
    )}
  >
    {isLoading ? (
      loadingIcon ?? (
        <Loader2 className="size-5 animate-spin" aria-hidden />
      )
    ) : (
      icon
    )}
  </button>
);

export const VehicleDetailMobileActions = ({
  vehicleId,
  showPhone,
  hasWhatsApp,
  vehicleTitle,
}: VehicleDetailMobileActionsProps) => {
  const {
    isLoadingPhone,
    isLoadingWhatsApp,
    handlePhoneClick,
    handleWhatsAppClick,
    dialogs,
  } = useVehicleContactDialogs({ vehicleId, vehicleTitle });

  const handleContactClick = () => {
    scrollToVehicleContactTab("contact");
  };

  const handleCallMeClick = () => {
    scrollToVehicleContactTab("call-me");
  };

  const showWhatsApp = showPhone && hasWhatsApp;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md supports-backdrop-filter:bg-white/80 lg:hidden"
        aria-label="Acciones de contacto"
      >
        <div className="mx-auto max-w-lg px-3 pt-2 pb-[max(0.625rem,env(safe-area-inset-bottom,0px))]">
          <div
            className="flex items-stretch gap-0.5 rounded-2xl border border-border/70 bg-muted/50 p-1 shadow-inner"
            role="toolbar"
            aria-label="Contactar al anunciante"
          >
            {showPhone ? (
              <MobileActionButton
                onClick={handlePhoneClick}
                ariaLabel="Llamar al anunciante"
                disabled={isLoadingPhone}
                isLoading={isLoadingPhone}
                accent="call"
                icon={<Phone className="size-5" strokeWidth={2} aria-hidden />}
              />
            ) : null}

            {showWhatsApp ? (
              <MobileActionButton
                onClick={handleWhatsAppClick}
                ariaLabel="Contactar por WhatsApp"
                disabled={isLoadingWhatsApp}
                isLoading={isLoadingWhatsApp}
                accent="whatsapp"
                icon={
                  <FaWhatsapp className="size-5" strokeWidth={2} aria-hidden />
                }
              />
            ) : null}

            <MobileActionButton
              onClick={handleContactClick}
              ariaLabel="Ir al formulario de contacto"
              icon={<Mail className="size-5" strokeWidth={2} aria-hidden />}
            />

            <MobileActionButton
              onClick={handleCallMeClick}
              ariaLabel="Ir al formulario Llámame"
              icon={
                <PhoneIncoming className="size-5" strokeWidth={2} aria-hidden />
              }
            />
          </div>
        </div>
      </nav>

      <div
        className="h-[calc(4.25rem+env(safe-area-inset-bottom,0))] lg:hidden"
        aria-hidden
      />

      <VehicleContactDialogs phone={dialogs.phone} whatsapp={dialogs.whatsapp} />
    </>
  );
};
