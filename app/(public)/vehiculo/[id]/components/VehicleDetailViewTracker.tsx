"use client";

import { useEffect, useRef } from "react";

import { useUser } from "@/app/contexts/auth/useUser";
import { vehiclesService } from "@/components/vehicles/services/vehiclesService";

interface VehicleDetailViewTrackerProps {
  vehicleId: string;
  ownerProfileId: string | null;
}

const sessionKey = (vehicleId: string) => `wiauto:vehicle-view:${vehicleId}`;

/**
 * Registra una visita a POST /v1/vehicles/:id/views (público).
 * - No cuenta si el visitante es el dueño del anuncio.
 * - Deduplica por pestaña/sesión con sessionStorage.
 */
export const VehicleDetailViewTracker = ({
  vehicleId,
  ownerProfileId,
}: VehicleDetailViewTrackerProps) => {
  const { user, isLoading } = useUser();
  const didRequestRef = useRef(false);

  useEffect(() => {
    if (isLoading || didRequestRef.current || !vehicleId) {
      return;
    }

    if (user?.id && ownerProfileId && user.id === ownerProfileId) {
      return;
    }

    try {
      if (sessionStorage.getItem(sessionKey(vehicleId))) {
        return;
      }
      sessionStorage.setItem(sessionKey(vehicleId), "1");
    } catch {
      // sessionStorage puede fallar (modo privado); seguimos con el ref.
    }

    didRequestRef.current = true;

    void vehiclesService.recordView(vehicleId, {
      ...(user?.id ? { user_id: user.id } : {}),
      metadata: { source: "vehicle_detail" },
    });
  }, [vehicleId, ownerProfileId, user?.id, isLoading]);

  return null;
};
