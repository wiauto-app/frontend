"use client";

import { MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVehicleContactDialogs } from "../hooks/useVehicleContactDialogs";
import { VehicleContactDialogs } from "./VehicleContactDialogs";
import { FaWhatsapp } from "react-icons/fa";

interface VehicleDetailContactChannelsProps {
  vehicleId: string;
  showPhone: boolean;
  hasWhatsApp: boolean;
  vehicleTitle: string;
}

export const VehicleDetailContactChannels = ({
  vehicleId,
  showPhone,
  hasWhatsApp,
  vehicleTitle,
}: VehicleDetailContactChannelsProps) => {
  const {
    isLoadingPhone,
    isLoadingWhatsApp,
    handlePhoneClick,
    handleWhatsAppClick,
    dialogs,
  } = useVehicleContactDialogs({ vehicleId, vehicleTitle });

  if (!showPhone) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handlePhoneClick}
          disabled={isLoadingPhone}
          aria-label="Ver teléfono del anunciante"
        >
          <Phone className="size-4" aria-hidden />
          {isLoadingPhone ? "Cargando..." : "Ver teléfono"}
        </Button>

        {hasWhatsApp ? (
          <Button
            type="button"
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
            onClick={handleWhatsAppClick}
            disabled={isLoadingWhatsApp}
            aria-label="Contactar por WhatsApp"
          >
            <FaWhatsapp className="size-5" aria-hidden />
            {isLoadingWhatsApp ? "Cargando..." : "WhatsApp"}
          </Button>
        ) : null}
      </div>

      <VehicleContactDialogs phone={dialogs.phone} whatsapp={dialogs.whatsapp} />
    </>
  );
};
