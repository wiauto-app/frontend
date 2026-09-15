import { BsBarChartFill } from "react-icons/bs";
import { FaStar, FaWhatsapp } from "react-icons/fa";
import {
  HiChartBar,
  HiCheckCircle,
  HiCog,
  HiEye,
  HiOutlineChartBar,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiPhone,
  HiUserGroup,
  HiUsers,
} from "react-icons/hi";
import { HiRocketLaunch } from "react-icons/hi2";

import type { StrapiIconPack } from "@/lib/strapi/resolveStrapiIconName";

/** Iconos usados por el CMS de la página /planes. */
export const plansIconPack = {
  HiEye,
  HiUsers,
  HiUserGroup,
  HiRocketLaunch,
  HiCog,
  HiChartBar,
  HiPhone,
  HiOutlineDocumentText,
  HiOutlineCloudUpload,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiCheckCircle,
  FaWhatsapp,
  FaStar,
  BsBarChartFill,
} as const satisfies StrapiIconPack;
