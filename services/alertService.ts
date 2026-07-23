import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  type ApiResponse,
} from "@/lib/api";
import type {
  Alert,
  CreateAlertFromVehiclePayload,
  UpdateAlertPayload,
} from "@/interfaces/alert.interface";
import type {
  AlertNotificationPreferences,
  UpdateAlertNotificationPreferencesPayload,
} from "@/interfaces/alert-notification-preferences.interface";
import type {
  FindNotificationsParams,
  InAppNotification,
} from "@/interfaces/notification.interface";
import type { PaginatedResult } from "@/types/general.types";

export const ALERTS_QUERY_KEY = ["alerts"] as const;
export const ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY = [
  "alert-notification-preferences",
] as const;
export const ALERT_NOTIFICATIONS_INBOX_QUERY_KEY = [
  "alerts-notifications-inbox",
] as const;
export const ALERT_NOTIFICATIONS_QUERY_KEY = ALERT_NOTIFICATIONS_INBOX_QUERY_KEY;

export const alertService = {
  findAll: (): Promise<ApiResponse<Alert[]>> => apiGet<Alert[]>("/v1/alerts"),

  findOne: (alertId: string): Promise<ApiResponse<Alert>> =>
    apiGet<Alert>(`/v1/alerts/${alertId}`),

  update: (
    alertId: string,
    payload: UpdateAlertPayload,
  ): Promise<ApiResponse<Alert>> =>
    apiPatch<Alert>(`/v1/alerts/${alertId}`, payload),

  remove: (alertId: string): Promise<ApiResponse<null>> =>
    apiDelete(`/v1/alerts/${alertId}`),

  markViewed: (alertId: string): Promise<ApiResponse<Alert>> =>
    apiPost<Alert>(`/v1/alerts/${alertId}/mark-viewed`, {}),

  getNotificationPreferences: (): Promise<
    ApiResponse<AlertNotificationPreferences>
  > =>
    apiGet<AlertNotificationPreferences>(
      "/v1/alerts/notification-preferences",
    ),

  updateNotificationPreferences: (
    payload: UpdateAlertNotificationPreferencesPayload,
  ): Promise<ApiResponse<AlertNotificationPreferences>> =>
    apiPatch<AlertNotificationPreferences>(
      "/v1/alerts/notification-preferences",
      payload,
    ),

  findNotifications: (
    params?: FindNotificationsParams,
  ): Promise<ApiResponse<PaginatedResult<InAppNotification>>> =>
    apiGet<PaginatedResult<InAppNotification>>("/v1/alerts/notifications", {
      page: params?.page ?? 1,
      limit: params?.limit ?? 30,
    }),

  markNotificationRead: (
    notificationId: string,
  ): Promise<ApiResponse<InAppNotification>> =>
    apiPatch<InAppNotification>(
      `/v1/alerts/notifications/${notificationId}/read`,
      {},
    ),

  markAllNotificationsRead: (): Promise<ApiResponse<{ updated: number }>> =>
    apiPost<{ updated: number }>("/v1/alerts/notifications/read-all", {}),

  createFromVehicle: (
    vehicleId: string,
    payload?: CreateAlertFromVehiclePayload,
  ): Promise<ApiResponse<Alert>> =>
    apiPost<Alert>(`/v1/alerts/from-vehicle/${vehicleId}`, payload ?? {}),
};
