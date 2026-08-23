import type { LucideIcon } from "lucide-react";
import { CarFront } from "lucide-react";
import type { IconType } from "react-icons";
import {
  BiSupport,
  BiSolidCar
} from "react-icons/bi";

import {
  FaCrown,
  FaQuoteLeft,
  FaRegCheckCircle,
  FaClipboardList,
  FaUsersCog,
  FaPhoneAlt,
} from "react-icons/fa";

import {
  GoShieldCheck,
  GoGitCompare,
  GoShield,
  GoClock,
  GoCheckCircle,
  GoLock,
  GoMail,
} from "react-icons/go";

import {
  HiCheckCircle,
  HiShieldCheck,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineLocationMarker,
  HiOutlineColorSwatch,
  HiOutlineCheckCircle,
  HiOutlineCog,
  HiWifi,
  HiCheck,
  HiOutlineTicket,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineClipboardCheck,
  HiOutlineCalculator,
  HiOutlineCash,
  HiOutlineChip,
  HiOutlineCollection,
  HiOutlineSupport,
  HiOutlineStar
} from "react-icons/hi";

import {
  HiOutlineMapPin,
  HiBolt,
  HiMiniReceiptPercent,
  HiCalendarDays,
} from "react-icons/hi2";

import {
  IoMdDocument,
  IoMdSpeedometer
} from "react-icons/io";
import { IoDocumentTextOutline, IoHappyOutline } from "react-icons/io5";


import {
  LuMonitorDot,
  LuTicketMinus,
} from "react-icons/lu";

import {
  MdCarRepair,
  MdCalculate,
  MdOutlineDiscount
} from "react-icons/md";

const STRAPI_ICONS = {  
  // Lucide
  CarFront,
  // Bootstrap Icons
  BiSupport,
  BiSolidCar,
  // Font Awesome
  FaCrown,
  FaQuoteLeft,
  FaRegCheckCircle,
  FaClipboardList,
  FaUsersCog,
  FaPhoneAlt,

  // GitHub Octicons
  GoShieldCheck,
  GoGitCompare,
  GoShield,
  GoClock,
  GoCheckCircle,
  GoLock,
  GoMail,

  // Heroicons
  HiCheckCircle,
  HiShieldCheck,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineLocationMarker,
  HiOutlineColorSwatch,
  HiOutlineCheckCircle,
  HiOutlineCog,
  HiBolt,
  HiWifi,
  HiOutlineMapPin,
  HiCheck,
  HiOutlineTicket,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineClipboardCheck,
  HiOutlineCalculator,
  HiOutlineCash,
  HiOutlineChip,
  HiOutlineCollection,
  HiOutlineSupport,
  HiOutlineStar,
  // Heroicons 2
  HiMiniReceiptPercent,
  HiCalendarDays,

  // Ionicons
  IoMdDocument,
  IoDocumentTextOutline,
  IoHappyOutline,
  IoMdSpeedometer,
  // Lucide
  LuMonitorDot,
  LuTicketMinus,

  // Material Design
  MdCarRepair,
  MdCalculate,
  MdOutlineDiscount,
} satisfies Record<string, IconType>;

export type ResolvedStrapiIcon = IconType | LucideIcon;

export const resolveStrapiIconName = (
  iconName: string | null | undefined,
): ResolvedStrapiIcon | null => {
  if (!iconName?.trim()) {
    return null;
  }

  return STRAPI_ICONS[iconName.trim() as keyof typeof STRAPI_ICONS] ?? null;
};