import { apiGet, apiPatch, type ApiResponse } from "@/lib/api";
import {
  defaultEnabledProactiveAlertTypes,
  PROACTIVE_ALERT_CATALOG,
} from "@/lib/proactive-alerts/proactive-alert-catalog";
import type {
  PatchProactiveAlertSettingsPayload,
  ProactiveAlertSettingsResponse,
} from "@/interfaces/proactive-alerts.interface";

export const PROACTIVE_ALERTS_SETTINGS_QUERY_KEY = [
  "proactive-alerts",
  "settings",
] as const;

const SETTINGS_PATH = "/v1/proactive-alerts/settings";

const mergeWithLocalCatalog = (
  remote: Partial<ProactiveAlertSettingsResponse> | null | undefined,
): ProactiveAlertSettingsResponse => {
  const catalog =
    remote?.catalog?.length && remote.catalog.length > 0
      ? remote.catalog
      : PROACTIVE_ALERT_CATALOG;

  const enabled_types =
    remote?.enabled_types && remote.enabled_types.length > 0
      ? remote.enabled_types
      : defaultEnabledProactiveAlertTypes();

  return {
    catalog,
    enabled_types,
    plan_includes_proactive_alerts: remote?.plan_includes_proactive_alerts,
  };
};

export const proactiveAlertsService = {
  getSettings: async (): Promise<
    ApiResponse<ProactiveAlertSettingsResponse>
  > => {
    const response = await apiGet<ProactiveAlertSettingsResponse>(SETTINGS_PATH);
    if (!response.ok || !response.data) {
      return response;
    }
    return {
      ...response,
      data: mergeWithLocalCatalog(response.data),
    };
  },

  patchSettings: (
    payload: PatchProactiveAlertSettingsPayload,
  ): Promise<ApiResponse<ProactiveAlertSettingsResponse>> =>
    apiPatch<ProactiveAlertSettingsResponse>(SETTINGS_PATH, payload),
};
