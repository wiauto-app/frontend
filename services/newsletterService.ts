import type {
  NewsletterSubscription,
  SubscribeNewsletterPayload,
  UpdateNewsletterPreferencesPayload,
} from "@/interfaces/newsletter.interface";
import {
  apiGet,
  apiPatch,
  apiPost,
  type ApiResponse,
} from "@/lib/api";

export const NEWSLETTER_ME_QUERY_KEY = ["newsletter-me"] as const;

export const newsletterService = {
  subscribe: (
    payload: SubscribeNewsletterPayload,
  ): Promise<ApiResponse<NewsletterSubscription>> =>
    apiPost<NewsletterSubscription>("/v1/newsletter/subscribe", payload),

  getMyPreferences: (): Promise<ApiResponse<NewsletterSubscription>> =>
    apiGet<NewsletterSubscription>("/v1/newsletter/me"),

  updateMyPreferences: (
    payload: UpdateNewsletterPreferencesPayload,
  ): Promise<ApiResponse<NewsletterSubscription>> =>
    apiPatch<NewsletterSubscription>("/v1/newsletter/me", payload),
};
