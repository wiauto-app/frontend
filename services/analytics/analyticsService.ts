import { fetchWithAuth } from "@/lib/api";
import type { RegistrationTrackingPayload } from "@/interfaces/publish-tracking.interface";

const V1_ANALYTICS_REGISTRATION = "/v1/analytics/registration";

export const analyticsService = {
  trackRegistration: async (
    payload: RegistrationTrackingPayload,
  ): Promise<void> => {
    await fetchWithAuth(V1_ANALYTICS_REGISTRATION, {
      method: "POST",
      body: JSON.stringify(payload),
      noResponse: true,
    });
  },
};
