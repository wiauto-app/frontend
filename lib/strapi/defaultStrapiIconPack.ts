import type { LucideIcon } from "lucide-react";
import { CarFront } from "lucide-react";
import type { IconType } from "react-icons";
import { BiSolidCar, BiSupport } from "react-icons/bi";
import {
  FaCarCrash,
  FaClipboardList,
  FaCrown,
  FaHandsHelping,
  FaPhoneAlt,
  FaQuoteLeft,
  FaRegCheckCircle,
  FaUsersCog,
} from "react-icons/fa";
import {
  GoCheckCircle,
  GoClock,
  GoGitCompare,
  GoLock,
  GoMail,
  GoShield,
  GoShieldCheck,
} from "react-icons/go";
import {
  HiArrowDown,
  HiArrowRight,
  HiCheck,
  HiCheckCircle,
  HiOutlineCalculator,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineClipboardCheck,
  HiOutlineCog,
  HiOutlineCollection,
  HiOutlineColorSwatch,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineIdentification,
  HiOutlineLocationMarker,
  HiOutlineChip,
  HiOutlineShoppingCart,
  HiOutlineStar,
  HiOutlineSupport,
  HiOutlineTicket,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiShieldCheck,
  HiWifi,
} from "react-icons/hi";
import {
  HiBolt,
  HiCalendarDays,
  HiMagnifyingGlass,
  HiMiniReceiptPercent,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { IoMdDocument, IoMdSpeedometer } from "react-icons/io";
import {
  IoDocumentLockOutline,
  IoDocumentTextOutline,
  IoHappyOutline,
} from "react-icons/io5";
import { LuMonitorDot, LuTicketMinus } from "react-icons/lu";
import { MdCalculate, MdCarRepair, MdOutlineDiscount } from "react-icons/md";

import type { StrapiIconPack } from "@/lib/strapi/resolveStrapiIconName";

/** Pack legacy compartido por páginas que aún no tienen pack propio. */
export const defaultStrapiIconPack = {
  CarFront,
  BiSupport,
  BiSolidCar,
  FaCrown,
  FaQuoteLeft,
  FaRegCheckCircle,
  FaClipboardList,
  FaUsersCog,
  FaPhoneAlt,
  FaCarCrash,
  FaHandsHelping,
  GoShieldCheck,
  GoGitCompare,
  GoShield,
  GoClock,
  GoCheckCircle,
  GoLock,
  GoMail,
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
  HiOutlineIdentification,
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
  HiMagnifyingGlass,
  HiOutlineSupport,
  HiOutlineStar,
  HiArrowRight,
  HiArrowDown,
  HiMiniReceiptPercent,
  HiCalendarDays,
  IoMdDocument,
  IoDocumentTextOutline,
  IoHappyOutline,
  IoMdSpeedometer,
  IoDocumentLockOutline,
  LuMonitorDot,
  LuTicketMinus,
  MdCarRepair,
  MdCalculate,
  MdOutlineDiscount,
} as const satisfies StrapiIconPack;

export type DefaultStrapiIconName = keyof typeof defaultStrapiIconPack;

export type { IconType, LucideIcon };
