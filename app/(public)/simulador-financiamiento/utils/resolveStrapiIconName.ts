import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as GoIcons from "react-icons/go";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";

type IconPack = Record<string, IconType>;

export type ResolvedStrapiIcon = IconType | LucideIcon;

/**
 * Resuelve strings `iconName` de Strapi (p. ej. LuGlobe, FaCar, MdCarRepair, MdCalculate, IoMdDocument, HiOutlineCheck)
 * al componente de icono correspondiente.
 */
export const resolveStrapiIconName = (
  iconName: string | null | undefined,
): ResolvedStrapiIcon | null => {
  if (!iconName?.trim()) {
    return null;
  }

  const name = iconName.trim();

  if (name.startsWith("Md")) {
    return (MdIcons as IconPack)[name] ?? null;
  }

  if (name.startsWith("Lu")) {
    return (LuIcons as IconPack)[name] ?? null;
  }

  if (name.startsWith("FaReg")) {
    return (FaIcons as IconPack)[name] ?? null;
  }
  if (name.startsWith("Fa")) {
    return (FaIcons as IconPack)[name] ?? null;
  }

  if (name.startsWith("Hi")) {
    return (Hi2Icons as IconPack)[name] ?? (HiIcons as IconPack)[name] ?? null;
  }

  if (name.startsWith("Io")) {
    return (Io5Icons as IconPack)[name] ?? (IoIcons as IconPack)[name] ?? null;
  }

  if (name.startsWith("Go")) {
    return (GoIcons as IconPack)[name] ?? null;
  }

  if (name.startsWith("Bi")) {
    return (BiIcons as IconPack)[name] ?? null;
  }

  return null;
};
