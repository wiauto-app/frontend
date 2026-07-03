"use client";

import { VehicleDetailPhoneDialog } from "./VehicleDetailPhoneDialog";
import { VehicleDetailWhatsAppDialog } from "./VehicleDetailWhatsAppDialog";

interface VehicleContactDialogsProps {
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

export const VehicleContactDialogs = ({
  phone,
  whatsapp,
}: VehicleContactDialogsProps) => (
  <>
    <VehicleDetailPhoneDialog
      open={phone.open}
      onOpenChange={phone.onOpenChange}
      phoneCode={phone.phoneCode}
      phone={phone.phone}
    />

    <VehicleDetailWhatsAppDialog
      open={whatsapp.open}
      onOpenChange={whatsapp.onOpenChange}
      whatsappUrl={whatsapp.whatsappUrl}
      vehicleTitle={whatsapp.vehicleTitle}
    />
  </>
);
