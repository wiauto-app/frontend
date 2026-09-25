import type { ProactiveAlertCatalogItem } from "@/lib/proactive-alerts/proactive-alert-catalog";

export interface ProactiveAlertSettingsResponse {
  catalog: ProactiveAlertCatalogItem[];
  enabled_types: string[];
  plan_includes_proactive_alerts?: boolean;
}

export interface PatchProactiveAlertSettingsPayload {
  enabled_types: string[];
}
