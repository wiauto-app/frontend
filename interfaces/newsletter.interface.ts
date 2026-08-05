export interface NewsletterSubscription {
  id: string;
  email: string;
  profile_id: string | null;
  enabled_category_slugs: string[];
  channel_email: boolean;
  channel_push: boolean;
  channel_sms: boolean;
  channel_in_app: boolean;
  channel_whatsapp: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscribeNewsletterPayload {
  email: string;
}

export interface UpdateNewsletterPreferencesPayload {
  enabled_category_slugs?: string[];
  channel_email?: boolean;
  channel_push?: boolean;
  channel_sms?: boolean;
  channel_in_app?: boolean;
  channel_whatsapp?: boolean;
}
