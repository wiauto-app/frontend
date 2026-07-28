import { buildApiUrl, fetchOptionalAuth } from "@/lib/api";

import { V1_VEHICLES_IMPRESSIONS } from "./route.constants";

const FLUSH_DELAY_MS = 4000;
const MAX_BATCH_SIZE = 50;

interface RecordVehicleImpressionsPayload {
  vehicle_ids: string[];
  profile_id?: string;
}

let pending_vehicle_ids = new Set<string>();
let current_profile_id: string | null = null;
let flush_timeout: ReturnType<typeof setTimeout> | null = null;

const buildPayload = (
  vehicle_ids: string[],
): RecordVehicleImpressionsPayload => ({
  vehicle_ids,
  ...(current_profile_id ? { profile_id: current_profile_id } : {}),
});

const sendViaBeacon = (payload: RecordVehicleImpressionsPayload): boolean => {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) {
    return false;
  }

  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });

  return navigator.sendBeacon(buildApiUrl(V1_VEHICLES_IMPRESSIONS), blob);
};

const sendViaFetch = (payload: RecordVehicleImpressionsPayload): void => {
  void fetchOptionalAuth(V1_VEHICLES_IMPRESSIONS, {
    method: "POST",
    body: JSON.stringify(payload),
    noResponse: true,
  });
};

export const flushVehicleImpressions = (
  options: { useBeacon?: boolean } = {},
): void => {
  if (flush_timeout) {
    clearTimeout(flush_timeout);
    flush_timeout = null;
  }

  if (pending_vehicle_ids.size === 0) {
    return;
  }

  const vehicle_ids = Array.from(pending_vehicle_ids);
  pending_vehicle_ids = new Set<string>();

  const payload = buildPayload(vehicle_ids);

  if (options.useBeacon && sendViaBeacon(payload)) {
    return;
  }

  sendViaFetch(payload);
};

const scheduleFlush = (): void => {
  if (flush_timeout) {
    return;
  }

  flush_timeout = setTimeout(() => {
    flush_timeout = null;
    flushVehicleImpressions();
  }, FLUSH_DELAY_MS);
};

export const enqueueVehicleImpression = (
  vehicleId: string,
  profileId?: string | null,
): void => {
  if (!vehicleId) {
    return;
  }

  if (profileId) {
    current_profile_id = profileId;
  }

  pending_vehicle_ids.add(vehicleId);

  if (pending_vehicle_ids.size >= MAX_BATCH_SIZE) {
    flushVehicleImpressions();
    return;
  }

  scheduleFlush();
};

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    flushVehicleImpressions({ useBeacon: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushVehicleImpressions({ useBeacon: true });
    }
  });
}
