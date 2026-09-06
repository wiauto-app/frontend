"use client";

import { Loader2, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Profile } from "@/components/ui/profile";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { useState } from "react";
import { useVehicleContactDialogs } from "../hooks/useVehicleContactDialogs";
import { VehicleContactDialogs } from "./VehicleContactDialogs";
import { VehicleDetailContactTabs } from "./VehicleDetailContactTabs";

interface VehicleDetailContactCardProps {
  vehicle: Vehicle;
  publisherProfileId: string;
}

export const VehicleDetailContactCard = ({
  vehicle,
  publisherProfileId,
}: VehicleDetailContactCardProps) => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const vehicleTitle = getVehicleDisplayName(vehicle);
  const showPhone = vehicle.show_phone !== false;
  const showWhatsApp = showPhone && vehicle.has_whatsapp === true;
  const advertiser = vehicle.dealership ?? vehicle.publisher;
  const advertiserDescription = vehicle.dealership
    ? "Concesionario"
    : "Vendedor particular";
  const location =
    vehicle.address_details?.municipality ??
    vehicle.address_details?.province ??
    vehicle.address?.split("\n")[0];
  const {
    isLoadingPhone,
    isLoadingWhatsApp,
    handlePhoneClick,
    handleWhatsAppClick,
    dialogs,
  } = useVehicleContactDialogs({ vehicleId: vehicle.id, vehicleTitle });

  return (
    <>
      <Card
        id="vehicle-contact-section"
        size="sm"
        className="scroll-mt-24 border-border/80 shadow-sm"
      >
        <CardContent className="space-y-4">
          <Profile
            name={advertiser.name}
            description={advertiserDescription}
            avatar_url={advertiser.avatar_url ?? undefined}
          />

          <Button
            type="button"
            className="w-full gap-2"
            onClick={() => setContactModalOpen(true)}
          >
            <MessageCircle className="size-4" aria-hidden />
            Contactar
          </Button>

          {showPhone || showWhatsApp ? (
            <div className="grid grid-cols-2 gap-2">
              {showPhone ? (
                <Button
                  type="button"
                  variant="outline"
                  className={showWhatsApp ? "gap-2" : "col-span-2 gap-2"}
                  onClick={handlePhoneClick}
                  disabled={isLoadingPhone}
                >
                  {isLoadingPhone ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Phone className="size-4" aria-hidden />
                  )}
                  Llamar
                </Button>
              ) : null}

              {showWhatsApp ? (
                <Button
                  type="button"
                  variant="outline"
                  className={showPhone ? "gap-2" : "col-span-2 gap-2"}
                  onClick={handleWhatsAppClick}
                  disabled={isLoadingWhatsApp}
                >
                  {isLoadingWhatsApp ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <FaWhatsapp className="size-4" aria-hidden />
                  )}
                  WhatsApp
                </Button>
              ) : null}
            </div>
          ) : null}

          {location ? (
            <p className="flex items-start gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {location}
            </p>
          ) : null}

          {vehicle.dealership ? (
            <a
              href={`/concesionaria/${vehicle.dealership.slug}`}
              className="block text-sm font-medium text-primary hover:underline"
            >
              Ver vehículos del concesionario →
            </a>
          ) : null}
        </CardContent>
      </Card>

      <Card size="sm" className="border-border/80 bg-muted/25 shadow-none">
        <CardContent className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Compra con seguridad
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Verifica la documentación y evita pagos por adelantado antes de
              ver el vehículo.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Contactar al anunciante</DialogTitle>
            <DialogDescription>
              Envía un mensaje o solicita que te llamen.
            </DialogDescription>
          </DialogHeader>
          <VehicleDetailContactTabs
            vehicleId={vehicle.id}
            publisherProfileId={publisherProfileId}
          />
        </DialogContent>
      </Dialog>

      <VehicleContactDialogs phone={dialogs.phone} whatsapp={dialogs.whatsapp} />
    </>
  );
};
