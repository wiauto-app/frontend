import { MEDIA_URL } from "@/constants/external.constant";

export type LogoTone = "black" | "base" | "white";

export type LogoFamily = "normal" | "pro" | "pro_sm";

export interface Logo {
  black: string;
  base: string;
  white: string;
}

export interface Logos {
  normal: Logo;
  pro: Logo;
  pro_sm: Logo;
}

export const LOGOS: Logos = {
  normal: {
    black: MEDIA_URL + "/wiauto-strapi/Group_1000002681_9d7c5628fc.avif",
    base: MEDIA_URL + "/wiauto-strapi/Group_1000002682_1_8cc20235e5.avif",
    white: MEDIA_URL + "/wiauto-strapi/Group_1000002683_b36c2b39cd.avif",
  },
  pro: {
    black: MEDIA_URL + "/wiauto-strapi/Group_1000002687_152cb8f7c2.avif",
    base: MEDIA_URL + "/wiauto-strapi/Group_1000002685_78898c3790.avif",
    white: MEDIA_URL + "/wiauto-strapi/Group_1000002686_35baad8239.avif",
  },
  pro_sm: {
    black: MEDIA_URL + "/wiauto-strapi/Group_1000002691_a88b1fd093.avif",
    base: MEDIA_URL + "/wiauto-strapi/Group_1000002689_b6c5706b5c.avif",
    white: MEDIA_URL + "/wiauto-strapi/Group_1000002690_48873f660a.avif",
  },
};
