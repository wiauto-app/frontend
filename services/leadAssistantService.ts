import { apiGet, apiPatch } from "@/lib/api";
import type {
  LeadAssistantSettingsResponse,
  PatchLeadAssistantSettingsPayload,
} from "@/interfaces/lead-assistant.interface";

const LEAD_ASSISTANT_SETTINGS_PATH = "/v1/lead-assistant/settings";

export const leadAssistantService = {
  getSettings() {
    return apiGet<LeadAssistantSettingsResponse>(LEAD_ASSISTANT_SETTINGS_PATH);
  },

  patchSettings(body: PatchLeadAssistantSettingsPayload) {
    return apiPatch<LeadAssistantSettingsResponse>(
      LEAD_ASSISTANT_SETTINGS_PATH,
      body,
    );
  },
};
