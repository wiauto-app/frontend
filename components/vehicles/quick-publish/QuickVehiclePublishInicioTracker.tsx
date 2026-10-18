"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics/funnel";

interface QuickVehiclePublishInicioTrackerProps {
  activeStep: number;
}

export const QuickVehiclePublishInicioTracker = ({
  activeStep,
}: QuickVehiclePublishInicioTrackerProps) => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || activeStep !== 1) {
      return;
    }

    firedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const entry =
      params.get("utm_source") === "meta" || params.has("fbclid")
        ? "ads"
        : "organic";

    track("publicar_inicio", { entry });
  }, [activeStep]);

  return null;
};
