"use client";

import { useEffect, useRef } from "react";

import { useUser } from "@/app/contexts/auth/useUser";

import { enqueueVehicleImpression } from "../services/vehicleImpressionsQueue";

const sessionKey = (vehicleId: string) =>
  `wiauto:vehicle-impression:${vehicleId}`;

const hasSessionImpression = (vehicleId: string): boolean => {
  try {
    return sessionStorage.getItem(sessionKey(vehicleId)) === "1";
  } catch {
    return false;
  }
};

const markSessionImpression = (vehicleId: string): void => {
  try {
    sessionStorage.setItem(sessionKey(vehicleId), "1");
  } catch {
    // sessionStorage puede fallar (modo privado); no es crítico para el tracking.
  }
};

/**
 * Registra una impresión (aparición en un listado) del vehículo cuando la
 * card entra al viewport. Deduplica por pestaña/sesión y agrupa envíos en
 * lote mediante `vehicleImpressionsQueue`.
 */
export const useVehicleImpressionTracker = <
  T extends HTMLElement = HTMLDivElement,
>(
  vehicleId: string,
) => {
  const { user } = useUser();
  const elementRef = useRef<T | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!vehicleId || hasTrackedRef.current) {
      return;
    }

    if (hasSessionImpression(vehicleId)) {
      hasTrackedRef.current = true;
      return;
    }

    const node = elementRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting && !hasTrackedRef.current) {
          hasTrackedRef.current = true;
          markSessionImpression(vehicleId);
          enqueueVehicleImpression(vehicleId, user?.id ?? null);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [vehicleId, user?.id]);

  return elementRef;
};
