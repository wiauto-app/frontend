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
  HiUsers,
} from "react-icons/hi";
import { HiRocketLaunch } from "react-icons/hi2";

import type { StrapiIconPack } from "@/lib/strapi/resolveStrapiIconName";

/** Iconos usados por el CMS de la página /planes. */
export const plansIconPack = {
  HiEye,
  HiUsers,
  HiRocketLaunch,
  HiCog,
  HiChartBar,
  HiPhone,
  HiOutlineDocumentText,
  HiOutlineCloudUpload,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiCheckCircle,
} as const satisfies StrapiIconPack;
