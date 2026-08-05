"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { newsService } from "@/app/(landing)/noticias/services/newsService";
import type { UpdateNewsletterPreferencesPayload } from "@/interfaces/newsletter.interface";
import {
  NEWSLETTER_ME_QUERY_KEY,
  newsletterService,
} from "@/services/newsletterService";

export const NEWSLETTER_CATEGORIES_QUERY_KEY = [
  "newsletter-categories",
] as const;

export const useNewsletterPreferences = () => {
  const queryClient = useQueryClient();

  const preferencesQuery = useQuery({
    queryKey: NEWSLETTER_ME_QUERY_KEY,
    queryFn: async () => {
      const response = await newsletterService.getMyPreferences();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message ||
            "No se pudieron cargar las preferencias del newsletter",
        );
      }
      return response.data;
    },
  });

  const categoriesQuery = useQuery({
    queryKey: NEWSLETTER_CATEGORIES_QUERY_KEY,
    queryFn: () => newsService.findAllCategories(),
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (payload: UpdateNewsletterPreferencesPayload) => {
      const response = await newsletterService.updateMyPreferences(payload);
      if (!response.ok || !response.data) {
        throw new Error(
          response.message ||
            "No se pudieron actualizar las preferencias del newsletter",
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(NEWSLETTER_ME_QUERY_KEY, data);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar las preferencias",
      );
    },
  });

  const handleUpdatePreferences = async (
    payload: UpdateNewsletterPreferencesPayload,
  ) => {
    await updatePreferencesMutation.mutateAsync(payload);
  };

  return {
    preferences: preferencesQuery.data,
    categories: categoriesQuery.data ?? [],
    isLoadingPreferences: preferencesQuery.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,
    preferencesError: preferencesQuery.error,
    categoriesError: categoriesQuery.error,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    handleUpdatePreferences,
  };
};
