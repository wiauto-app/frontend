"use client";

import { useState } from "react";

import type { Vehicle } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";
import { VehicleDetailDescription } from "./VehicleDetailDescription";
import { VehicleDetailFeatures } from "./VehicleDetailFeatures";
import { VehicleDetailFinancingSection } from "./VehicleDetailFinancingSection";
import { VehicleDetailLocationSection } from "./VehicleDetailLocationSection";
import { VehicleDetailMainDataSection } from "./VehicleDetailMainDataSection";
import { VehicleDetailServicesSection } from "./VehicleDetailServicesSection";
import {
  VehicleDetailTabs,
  type VehicleDetailTabValue,
} from "./vehicleDetailTabs";
import { VehicleDetailWarrantySection } from "./VehicleDetailWarrantySection";

interface VehicleDetailTabbedContentProps {
  vehicle: Vehicle;
}

export const VehicleDetailTabbedContent = ({
  vehicle,
}: VehicleDetailTabbedContentProps) => {
  const [activeTab, setActiveTab] =
    useState<VehicleDetailTabValue>("main-data");

  const renderActivePanel = () => {
    switch (activeTab) {
      case "equipment":
        return vehicle.features.length > 0 || vehicle.services.length > 0 ? (
          <div className="space-y-6">
            <VehicleDetailFeatures features={vehicle.features} />
            <VehicleDetailServicesSection services={vehicle.services} />
          </div>
        ) : (
          <VehicleDetailCard title="Equipamiento">
            <p className="text-sm text-muted-foreground">
              El anunciante no ha especificado el equipamiento de este vehículo.
            </p>
          </VehicleDetailCard>
        );
      case "description":
        return <VehicleDetailDescription description={vehicle.description} />;
      case "financing":
        return <VehicleDetailFinancingSection vehicle={vehicle} />;
      case "guarantees":
        return <VehicleDetailWarrantySection vehicle={vehicle} />;
      case "location":
        return <VehicleDetailLocationSection vehicle={vehicle} />;
      case "main-data":
      default:
        return <VehicleDetailMainDataSection vehicle={vehicle} />;
    }
  };

  return (
    <div className="space-y-6">
      <VehicleDetailTabs value={activeTab} onValueChange={setActiveTab} />
      <div
        key={activeTab}
        id={`vehicle-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`vehicle-tab-${activeTab}`}
        className="animate-in fade-in-0 duration-200"
      >
        {renderActivePanel()}
      </div>
    </div>
  );
};
