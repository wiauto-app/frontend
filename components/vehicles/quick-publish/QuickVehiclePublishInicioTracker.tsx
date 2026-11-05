"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics/funnel";

import { QUICK_VEHICLE_STEP_IDS } from "./quick-vehicle-wizard.constants";

interface QuickVehiclePublishInicioTrackerProps {
  activeStep: number;
}

export const QuickVehiclePublishInicioTracker = ({
  activeStep,
}: QuickVehiclePublishInicioTrackerProps) => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || activeStep !== QUICK_VEHICLE_STEP_IDS.data) {
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
