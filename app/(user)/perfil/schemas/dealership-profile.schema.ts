import { z } from "zod";

import type {
  CreateMyDealershipPayload,
  DealershipDetail,
  UpdateDealershipPayload,
} from "@/services/dealerships/types/dealership.types";

export const slugifyDealershipName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const dealershipProfileFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z
    .string()
    .trim()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Usa solo minúsculas, números y guiones",
    ),
  avatar_url: z
    .string()
    .trim()
    .min(1, "La imagen de avatar es obligatoria"),
  banner_url: z
    .string()
    .trim()
    .min(1, "La imagen de banner es obligatoria"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  website_url: z.string().trim().url("Introduce una URL válida"),
  email: z.string().trim().email("Introduce un correo electrónico válido"),
  phone: z.object({
    phone_code: z.string().min(1, "El prefijo telefónico es obligatorio"),
    phone: z.string().min(6, "El teléfono debe tener al menos 6 dígitos"),
  }),
  show_phone: z.boolean(),
  address: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres"),
  lat: z.number({ error: "Selecciona una ubicación en el mapa" }),
  lng: z.number({ error: "Selecciona una ubicación en el mapa" }),
});

export type DealershipProfileFormValues = z.infer<
  typeof dealershipProfileFormSchema
>;

export const EMPTY_DEALERSHIP_PROFILE_FORM: DealershipProfileFormValues = {
  name: "",
  slug: "",
  avatar_url: "",
  banner_url: "",
  description: "",
  website_url: "",
  email: "",
  phone: { phone_code: "+34", phone: "" },
  show_phone: true,
  address: "",
  lat: 40.4168,
  lng: -3.7038,
};

export const mapDealershipDetailToFormValues = (
  dealership: DealershipDetail,
): DealershipProfileFormValues => ({
  name: dealership.name,
  slug: dealership.slug,
  avatar_url: dealership.avatar_url ?? "",
  banner_url: dealership.banner_url ?? "",
  description: dealership.description,
  website_url: dealership.website_url ?? "",
  email: dealership.email,
  phone: {
    phone_code: dealership.phone_code?.trim() || "+34",
    phone: dealership.phone ?? "",
  },
  show_phone: dealership.show_phone ?? true,
  address: dealership.address,
  lat: dealership.lat ?? 40.4168,
  lng: dealership.lng ?? -3.7038,
});

export const mapDealershipFormToCreatePayload = (
  values: DealershipProfileFormValues,
): CreateMyDealershipPayload => ({
  name: values.name.trim(),
  slug: values.slug.trim(),
  avatar_url: values.avatar_url.trim(),
  banner_url: values.banner_url.trim(),
  description: values.description.trim(),
  website_url: values.website_url.trim(),
  email: values.email.trim(),
  phone_code: values.phone.phone_code,
  phone: values.phone.phone,
  show_phone: values.show_phone,
  address: values.address.trim(),
  lat: values.lat,
  lng: values.lng,
});

export const mapDealershipFormToUpdatePayload = (
  values: DealershipProfileFormValues,
): UpdateDealershipPayload => ({
  name: values.name.trim(),
  slug: values.slug.trim(),
  avatar_url: values.avatar_url.trim(),
  banner_url: values.banner_url.trim(),
  description: values.description.trim(),
  website_url: values.website_url.trim(),
  email: values.email.trim(),
  phone_code: values.phone.phone_code,
  phone: values.phone.phone,
  show_phone: values.show_phone,
  address: values.address.trim(),
  lat: values.lat,
  lng: values.lng,
});
