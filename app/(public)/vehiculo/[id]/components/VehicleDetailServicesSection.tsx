"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { VehicleService } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";

const VISIBLE_SERVICES_LIMIT = 6;

type VehicleDetailServicesSectionProps = {
  services: VehicleService[];
};

export const VehicleDetailServicesSection = ({
  services,
}: VehicleDetailServicesSectionProps) => {
  const [is_expanded, setIsExpanded] = useState(false);

  if (services.length === 0) {
    return null;
  }

  const has_hidden_services = services.length > VISIBLE_SERVICES_LIMIT;
  const visible_services =
    is_expanded || !has_hidden_services
      ? services
      : services.slice(0, VISIBLE_SERVICES_LIMIT);

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <VehicleDetailCard title="Servicios incluidos">
      <ul className="grid grid-cols-3 gap-x-4 gap-y-3">
        {visible_services.map((service) => (
          <li
            key={service.id}
            className="list-inside list-disc text-sm text-gray-700 marker:text-gray-400"
          >
            {service.name}
          </li>
        ))}
      </ul>

      {has_hidden_services ? (
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={handleToggleExpanded}
        >
          {is_expanded ? "Mostrar menos" : "Mostrar más"}
        </Button>
      ) : null}
    </VehicleDetailCard>
  );
};
