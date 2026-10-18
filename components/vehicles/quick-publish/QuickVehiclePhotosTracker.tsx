"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { track } from "@/lib/analytics/funnel";

/** Dispara `publicar_fotos` cuando hay 3 imágenes confirmadas. */
export const QuickVehiclePhotosTracker = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const images = form.watch("images");
  const firedRef = useRef(false);

  useEffect(() => {
    const count = images?.length ?? 0;
    if (firedRef.current || count < 3) {
      return;
    }

    firedRef.current = true;
    track("publicar_fotos", { photo_count: count });
  }, [images]);

  return null;
};
