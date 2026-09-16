"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const VehicleDetailContactChannels = dynamic(
  () =>
    import("./VehicleDetailContactChannels").then(
      (mod) => mod.VehicleDetailContactChannels,
    ),
  { ssr: false, loading: () => <Skeleton className="w-full h-170" /> },
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
      className="sticky top-26 right-0 hidden h-fit space-y-6 lg:block "
      size="sm"
    >
      <CardContent className="flex flex-col gap-6">
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
