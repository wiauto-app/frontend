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
    black: MEDIA_URL + "/wiauto-strapi/Group_1000002681_2963bea72b.avif",
    base: MEDIA_URL + "/wiauto-strapi/Group_1000002682_104ab9e4f3.avif",
    white: MEDIA_URL + "/wiauto-strapi/Group_1000002683_8ebb8a53ac.avif",
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
