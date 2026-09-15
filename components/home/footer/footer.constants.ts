import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaPinterest,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const FACEBOOK_COLOR = "#0A5BFF";
export const INSTAGRAM_COLOR = "#D9266F";
export const YOUTUBE_COLOR = "#FF002F";
export const TELEGRAM_COLOR = "#249DE3";
export const WHATSAPP_COLOR = "#25D366";
export const TWITTER_COLOR = "#000000";
export const LINKEDIN_COLOR = "#0077B5";
export const PINTEREST_COLOR = "#E60023";
export const COPY_LINK_COLOR = "#64748B";

export type SocialNetworkId =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "telegram"
  | "whatsapp"
  | "pinterest"
  | "copy_link";

export interface SocialNetworkConfig {
  id: SocialNetworkId;
  label: string;
  color: string;
  Icon: IconType;
  /** Palabras clave para detectar la red en labels del CMS (footer). */
  matchKeywords: string[];
}

export const SOCIAL_NETWORKS: SocialNetworkConfig[] = [
  {
    id: "facebook",
    label: "Facebook",
    color: FACEBOOK_COLOR,
    Icon: FaFacebook,
    matchKeywords: ["facebook"],
  },
  {
    id: "instagram",
    label: "Instagram",
    color: INSTAGRAM_COLOR,
    Icon: FaInstagram,
    matchKeywords: ["instagram"],
  },
  {
    id: "twitter",
    label: "X",
    color: TWITTER_COLOR,
    Icon: FaXTwitter,
    matchKeywords: ["twitter", "x"],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: LINKEDIN_COLOR,
    Icon: FaLinkedin,
    matchKeywords: ["linkedin"],
  },
  {
    id: "youtube",
    label: "YouTube",
    color: YOUTUBE_COLOR,
    Icon: FaYoutube,
    matchKeywords: ["youtube"],
  },
  {
    id: "telegram",
    label: "Telegram",
    color: TELEGRAM_COLOR,
    Icon: FaTelegram,
    matchKeywords: ["telegram"],
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: WHATSAPP_COLOR,
    Icon: FaWhatsapp,
    matchKeywords: ["whatsapp"],
  },
  {
    id: "pinterest",
    label: "Pinterest",
    color: PINTEREST_COLOR,
    Icon: FaPinterest,
    matchKeywords: ["pinterest"],
  },
  {
    id: "copy_link",
    label: "Copiar enlace",
    color: COPY_LINK_COLOR,
    Icon: FaLink,
    matchKeywords: ["copiar", "enlace", "link"],
  },
];

/** Redes usadas en el footer (perfiles CMS). */
export const FOOTER_SOCIAL_NETWORK_IDS: SocialNetworkId[] = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
  "telegram",
];

/** Acciones de compartir en detalle de noticia. */
export const NEWS_SHARE_NETWORK_IDS: SocialNetworkId[] = [
  "whatsapp",
  "facebook",
  "twitter",
  "linkedin",
  "pinterest",
  "copy_link",
];

const normalizeSocialLabel = (label: string): string =>
  label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const findSocialNetworkByLabel = (
  label: string,
): SocialNetworkConfig | undefined => {
  const normalized = normalizeSocialLabel(label);

  return SOCIAL_NETWORKS.find((network) =>
    network.matchKeywords.some((keyword) => {
      if (keyword === "x") {
        return normalized === "x";
      }
      return normalized.includes(keyword);
    }),
  );
};

export const getSocialNetworksByIds = (
  ids: SocialNetworkId[],
): SocialNetworkConfig[] => {
  const byId = new Map(SOCIAL_NETWORKS.map((network) => [network.id, network]));

  return ids
    .map((id) => byId.get(id))
    .filter((network): network is SocialNetworkConfig => Boolean(network));
};
