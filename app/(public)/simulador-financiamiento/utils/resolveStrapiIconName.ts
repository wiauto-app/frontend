import type { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as Io5Icons from "react-icons/io5";
import * as GoIcons from "react-icons/go";
import * as LuIcons from "react-icons/lu";

type IconPack = Record<string, IconType>;

/**
 * Resuelve strings `iconName` de Strapi (p. ej. LuGlobe, FaCar, HiOutlineCheck, IoCarSport)
 * al componente de icono correspondiente.
 */
export const resolveStrapiIconName = (
  iconName: string | null | undefined,
): IconType | null => {
  if (!iconName?.trim()) {
    return null;
  }

  const name = iconName.trim();

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
    return (Io5Icons as IconPack)[name] ?? null;
  }

  if (name.startsWith("Go")) {
    return (GoIcons as IconPack)[name] ?? null;
  }


  return null;
};
