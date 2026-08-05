"use client";

import {
  Mail,
  MessageSquare,
  Monitor,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import type {
  NewsletterSubscription,
  UpdateNewsletterPreferencesPayload,
} from "@/interfaces/newsletter.interface";

import { useNewsletterPreferences } from "@/app/usuario/newsletter/hooks/useNewsletterPreferences";

interface ChannelItem {
  field: keyof Pick<
    NewsletterSubscription,
    "channel_push" | "channel_email" | "channel_in_app" | "channel_whatsapp"
  >;
  label: string;
  icon: LucideIcon;
}

const CHANNEL_ITEMS: ChannelItem[] = [
  { field: "channel_push", label: "Push móvil", icon: Smartphone },
  { field: "channel_email", label: "Email", icon: Mail },
  { field: "channel_in_app", label: "In-app", icon: Monitor },
  { field: "channel_whatsapp", label: "WhatsApp", icon: MessageSquare },
];

interface PreferenceToggleProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: LucideIcon;
}

const PreferenceToggle = ({
  id,
  label,
  checked,
  disabled = false,
  onCheckedChange,
  icon: Icon,
}: PreferenceToggleProps) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4">
    <div className="flex min-w-0 items-center gap-3 text-gray-700">
      {Icon ? (
        <Icon className="h-5 w-5 shrink-0 text-blue-500" aria-hidden />
      ) : null}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <Switch
      id={id}
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onCheckedChange={onCheckedChange}
    />
  </div>
);

export const NewsletterPreferencesContent = () => {
  const {
    preferences,
    categories,
    isLoadingPreferences,
    isLoadingCategories,
    preferencesError,
    categoriesError,
    isUpdatingPreferences,
    handleUpdatePreferences,
  } = useNewsletterPreferences();

  const handleToggleChannel = (
    field: keyof UpdateNewsletterPreferencesPayload,
    checked: boolean,
  ) => {
    void handleUpdatePreferences({ [field]: checked });
  };

  const handleToggleCategory = (slug: string, checked: boolean) => {
    if (!preferences) {
      return;
    }

    const current = new Set(preferences.enabled_category_slugs);
    if (checked) {
      current.add(slug);
    } else {
      current.delete(slug);
    }

    void handleUpdatePreferences({
      enabled_category_slugs: Array.from(current),
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
        <p className="mt-1 text-sm text-gray-500">
          Elige cómo y sobre qué categorías de noticias quieres recibir avisos.
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Canales</h2>
        {isLoadingPreferences ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : preferencesError || !preferences ? (
          <p className="text-sm text-red-600" role="alert">
            {preferencesError instanceof Error
              ? preferencesError.message
              : "No se pudieron cargar los canales del newsletter"}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {CHANNEL_ITEMS.map((channel) => (
              <PreferenceToggle
                key={channel.field}
                id={`newsletter-${channel.field}`}
                label={channel.label}
                icon={channel.icon}
                checked={preferences[channel.field]}
                disabled={isUpdatingPreferences}
                onCheckedChange={(checked) =>
                  handleToggleChannel(channel.field, checked)
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Categorías</h2>
        {isLoadingPreferences || isLoadingCategories ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : preferencesError || categoriesError || !preferences ? (
          <p className="text-sm text-red-600" role="alert">
            {preferencesError instanceof Error
              ? preferencesError.message
              : categoriesError instanceof Error
                ? categoriesError.message
                : "No se pudieron cargar las categorías"}
          </p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay categorías de noticias disponibles ahora mismo.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {categories.map((category) => (
              <PreferenceToggle
                key={category.slug}
                id={`newsletter-category-${category.slug}`}
                label={category.name}
                checked={preferences.enabled_category_slugs.includes(
                  category.slug,
                )}
                disabled={isUpdatingPreferences}
                onCheckedChange={(checked) =>
                  handleToggleCategory(category.slug, checked)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
