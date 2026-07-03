"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleDetailContactForm } from "./VehicleDetailContactForm";
import { VehicleDetailCallMeForm } from "./VehicleDetailCallMeForm";
import type { VehicleDetailAdvertiser } from "../types/vehicle-detail.types";
import {
  VEHICLE_CONTACT_TAB_EVENT,
  type VehicleContactTab,
} from "../utils/vehicleContactTab.utils";

interface VehicleDetailContactTabsProps {
  vehicleId: string;
  publisherProfileId: string;
  advertiser: VehicleDetailAdvertiser;
}

export const VehicleDetailContactTabs = ({
  vehicleId,
  publisherProfileId,
  advertiser,
}: VehicleDetailContactTabsProps) => {
  const [activeTab, setActiveTab] = useState<VehicleContactTab>("contact");

  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ tab: VehicleContactTab }>;
      setActiveTab(customEvent.detail.tab);
      document
        .getElementById("vehicle-contact-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener(VEHICLE_CONTACT_TAB_EVENT, handleTabChange);
    return () => {
      window.removeEventListener(VEHICLE_CONTACT_TAB_EVENT, handleTabChange);
    };
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as VehicleContactTab)}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="contact">Contactar</TabsTrigger>
        <TabsTrigger value="call-me">Llámame</TabsTrigger>
      </TabsList>

      <TabsContent value="contact" className="mt-4">
        <VehicleDetailContactForm
          vehicleId={vehicleId}
          publisherProfileId={publisherProfileId}
          advertiser={advertiser}
        />
      </TabsContent>

      <TabsContent value="call-me" className="mt-4">
        <VehicleDetailCallMeForm vehicleId={vehicleId} />
      </TabsContent>
    </Tabs>
  );
};
