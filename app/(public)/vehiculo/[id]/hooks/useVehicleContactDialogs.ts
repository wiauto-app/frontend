"use client";

import { useState } from "react";
import { toast } from "sonner";

import { vehicleContactClickService } from "@/services/vehicleContactClickService";
import { trackMetaContact } from "@/lib/analytics/metaPixel";

interface UseVehicleContactDialogsOptions {
  vehicleId: string;
  vehicleTitle: string;
}

interface VehicleContactDialogsState {
  phone: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    phoneCode: string;
    phone: string;
  };
  whatsapp: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    whatsappUrl: string;
    vehicleTitle: string;
  };
}

interface UseVehicleContactDialogsResult {
  isLoadingPhone: boolean;
  isLoadingWhatsApp: boolean;
  handlePhoneClick: () => void;
  handleWhatsAppClick: () => void;
  dialogs: VehicleContactDialogsState;
}

export const useVehicleContactDialogs = ({
  vehicleId,
  vehicleTitle,
}: UseVehicleContactDialogsOptions): UseVehicleContactDialogsResult => {
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false);

  const handlePhoneClick = () => {
    setIsLoadingPhone(true);
    void vehicleContactClickService
      .recordPhoneClick(vehicleId)
      .then((response) => {
        if (!response.ok || !response.data) {
          toast.error(response.message || "No se pudo obtener el teléfono");
          return;
        }

        trackMetaContact({
          channel: "phone",
          vehicle: { id: vehicleId, name: vehicleTitle },
        });

        setPhoneCode(response.data.phone_code);
        setPhone(response.data.phone);
        setPhoneDialogOpen(true);
      })
      .catch(() => {
        toast.error("No se pudo obtener el teléfono");
      })
      .finally(() => {
        setIsLoadingPhone(false);
      });
  };

  const handleWhatsAppClick = () => {
    setIsLoadingWhatsApp(true);
    void vehicleContactClickService
      .recordWhatsAppClick(vehicleId)
      .then((response) => {
        if (!response.ok || !response.data?.whatsapp_url) {
          toast.error(response.message || "No se pudo abrir WhatsApp");
          return;
        }

        trackMetaContact({
          channel: "whatsapp",
          vehicle: { id: vehicleId, name: vehicleTitle },
        });

        setWhatsappUrl(response.data.whatsapp_url);
        setWhatsappDialogOpen(true);
      })
      .catch(() => {
        toast.error("No se pudo abrir WhatsApp");
      })
      .finally(() => {
        setIsLoadingWhatsApp(false);
      });
  };

  return {
    isLoadingPhone,
    isLoadingWhatsApp,
    handlePhoneClick,
    handleWhatsAppClick,
    dialogs: {
      phone: {
        open: phoneDialogOpen,
        onOpenChange: setPhoneDialogOpen,
        phoneCode,
        phone,
      },
      whatsapp: {
        open: whatsappDialogOpen,
        onOpenChange: setWhatsappDialogOpen,
        whatsappUrl,
        vehicleTitle,
      },
    },
  };
};
