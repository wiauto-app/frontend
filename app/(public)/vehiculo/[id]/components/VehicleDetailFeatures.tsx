"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

import { Feature } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailGeneralSpecsSectionProps = {
  features: Feature[];
};

const MAX_VISIBLE = 10;

export const VehicleDetailFeatures = ({
  features,
}: VehicleDetailGeneralSpecsSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  const visibleFeatures = expanded ? features : features.slice(0, MAX_VISIBLE);
  const hasMore = features.length > MAX_VISIBLE;

  if (visibleFeatures.length === 0) {
    return null;
  }
  return (
    <VehicleDetailCard title="Equipamiento">
      <div className="flex flex-wrap gap-3">
        {visibleFeatures.map((feature) => (
          <div
            key={feature.id}
            className="
              flex items-center gap-2
              rounded-full
              border border-primary/10
              bg-primary/5
              px-4 py-2
              transition-all
              hover:bg-primary/10
              hover:border-primary/20
            "
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{feature.name}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="
              inline-flex items-center gap-2
              text-sm font-medium
              text-primary
              hover:opacity-80
              transition-opacity
            "
          >
            {expanded ? (
              <>
                Ver menos
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Ver {features.length - MAX_VISIBLE} más
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </VehicleDetailCard>
  );
};
