import { apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  DealershipFinancingSettings,
  PatchDealershipFinancingSettingsPayload,
  QuoteVehicleFinancingPayload,
  VehicleFinancingQuote,
} from "@/interfaces/financing.interface";

const FINANCING_SETTINGS_PATH = "/v1/financing/settings";

export const DEALERSHIP_FINANCING_SETTINGS_QUERY_KEY = [
  "dealership-financing",
  "settings",
] as const;

export const DEALERSHIP_FINANCING_STATUS_QUERY_KEY = [
  "dealership-financing",
  "status",
] as const;

export const dealershipFinancingService = {
  getStatus() {
    return apiGet<{ enabled: boolean }>("/v1/financing/status");
  },

  getSettings() {
    return apiGet<DealershipFinancingSettings>(FINANCING_SETTINGS_PATH);
  },

  patchSettings(body: PatchDealershipFinancingSettingsPayload) {
    return apiPatch<DealershipFinancingSettings>(FINANCING_SETTINGS_PATH, body);
  },

  quoteVehicle(vehicleId: string, body: QuoteVehicleFinancingPayload) {
    return apiPost<VehicleFinancingQuote>(
      `/v1/vehicles/${vehicleId}/financing/quote`,
      body,
    );
  },
};
