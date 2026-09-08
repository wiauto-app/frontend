import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export type ResolvedStrapiIcon = IconType | LucideIcon;

export type StrapiIconPack = Record<string, ResolvedStrapiIcon>;

/**
 * Resuelve un iconName de Strapi contra un pack explícito.
 * Sin pack no importa el default (evita arrastrar iconos no usados).
 */
export const resolveStrapiIconName = (
  iconName: string | null | undefined,
  iconPack?: StrapiIconPack | null,
): ResolvedStrapiIcon | null => {
  if (!iconName?.trim() || !iconPack) {
    return null;
  }

  return iconPack[iconName.trim()] ?? null;
};

/**
 * Igual que resolveStrapiIconName, pero si no hay pack carga el default bajo demanda.
 */
export const resolveStrapiIconNameAsync = async (
  iconName: string | null | undefined,
  iconPack?: StrapiIconPack | null,
): Promise<ResolvedStrapiIcon | null> => {
  if (!iconName?.trim()) {
    return null;
  }

  if (iconPack) {
    return resolveStrapiIconName(iconName, iconPack);
  }

  const { defaultStrapiIconPack } = await import("./defaultStrapiIconPack");
  return resolveStrapiIconName(iconName, defaultStrapiIconPack);
};
