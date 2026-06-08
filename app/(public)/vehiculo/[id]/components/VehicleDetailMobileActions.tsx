"use client";

import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type VehicleDetailMobileActionsProps = {
  contact_phone: string;
};

export const VehicleDetailMobileActions = ({
  contact_phone,
}: VehicleDetailMobileActionsProps) => (
  <>
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg lg:hidden">
      <div className="flex gap-3">
        <a
          href={`tel:${contact_phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white"
        >
          <Phone className="size-5" aria-hidden />
          Llamar
        </a>
        <Button type="button" className="flex-1 gap-2">
          <Mail className="size-5" aria-hidden />
          Contactar
        </Button>
      </div>
    </div>
    <div className="h-20 lg:hidden" aria-hidden />
  </>
);
