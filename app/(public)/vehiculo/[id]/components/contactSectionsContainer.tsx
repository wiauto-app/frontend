"use client";

import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

const VehicleDetailContactChannels = dynamic(
  () =>
    import("./VehicleDetailContactChannels").then(
      (mod) => mod.VehicleDetailContactChannels,
    ),
  { ssr: false },
);

const VehicleDetailContactTabs = dynamic(
  () =>
    import("./VehicleDetailContactTabs").then(
      (mod) => mod.VehicleDetailContactTabs,
    ),
  { ssr: false },
);

interface ContactSectionsContainerProps {
  vehicleId: string;
  showPhone: boolean;
  hasWhatsApp: boolean;
  vehicleTitle: string;
  publisherProfileId: string;
}

export const ContactSectionsContainer = ({
  vehicleId,
  showPhone,
  hasWhatsApp,
  vehicleTitle,
  publisherProfileId,
}: ContactSectionsContainerProps) => {
  return (
    <Card
      id="vehicle-contact-section"
      className="sticky top-26 right-0 hidden h-fit scroll-mt-24 space-y-6 lg:block"
      size="sm"
    >
      <CardContent className="space-y-6">
        <VehicleDetailContactChannels
          vehicleId={vehicleId}
          showPhone={showPhone}
          hasWhatsApp={hasWhatsApp}
          vehicleTitle={vehicleTitle}
        />
        <VehicleDetailContactTabs
          vehicleId={vehicleId}
          publisherProfileId={publisherProfileId}
        />
      </CardContent>
    </Card>
  );
};
