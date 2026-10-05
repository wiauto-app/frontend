import { FaHandshake } from "react-icons/fa";
import {
  HiCheckCircle,
  HiOutlineChartBar,
  HiOutlineCurrencyEuro,
  HiOutlineDocumentText,
  HiOutlineEyeOff,
  HiOutlineLightningBolt,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineSpeakerphone,
  HiOutlineUser,
  HiOutlineUsers,
} from "react-icons/hi";

import type { StrapiIconPack } from "@/lib/strapi/resolveStrapiIconName";

/** Iconos usados por el CMS de la página /tasador (`iconName` en Strapi). */
export const tasadorIconPack = {
  FaHandshake,
  HiCheckCircle,
  HiOutlineChartBar,
  HiOutlineCurrencyEuro,
  HiOutlineDocumentText,
  HiOutlineEyeOff,
  HiOutlineLightningBolt,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineSpeakerphone,
  HiOutlineUser,
  HiOutlineUsers,
} satisfies StrapiIconPack;
