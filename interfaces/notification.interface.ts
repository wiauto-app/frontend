export interface InAppNotification {
  id: string;
  profile_id: string;
  category: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

export interface FindNotificationsParams {
  page?: number;
  limit?: number;
}
