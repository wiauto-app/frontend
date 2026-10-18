import type { PublishTrackingPayload } from "@/interfaces/publish-tracking.interface";
import {
  getMetaCookies,
  hasMarketingConsent,
  newEventId,
  peekVehicleDataEventId,
} from "@/lib/analytics/funnel";

export const buildPublishTracking = (
  publishEventId: string,
): PublishTrackingPayload => {
  const { fbp, fbc } = getMetaCookies();
  const vehicleDataEventId = peekVehicleDataEventId();

  return {
    eventId: publishEventId,
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    pageUrl: window.location.href,
    consent: hasMarketingConsent(),
    ...(vehicleDataEventId ? { vehicleDataEventId } : {}),
  };
};

export const createPublishEventId = (): string => newEventId();
