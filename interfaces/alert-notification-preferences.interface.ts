export type AlertNotificationFrequency = "instant" | "daily" | "weekly";

export type AlertNotificationPreferences = {
  profile_id: string;
  notify_new_matches: boolean;
  notify_price_drops: boolean;
  notify_favorite_changes: boolean;
  notify_new_messages: boolean;
  notify_seller_replies: boolean;
  notify_saved_vehicle_reminders: boolean;
  saved_vehicle_reminder_days: number;
  frequency: AlertNotificationFrequency;
  channel_email: boolean;
  channel_push: boolean;
  channel_sms: boolean;
  created_at: string;
  updated_at: string;
};

export type UpdateAlertNotificationPreferencesPayload = Partial<
  Omit<AlertNotificationPreferences, "profile_id" | "created_at" | "updated_at">
>;
