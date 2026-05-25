import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type { HomePageData } from "../types/home-page.types";
import type {
  StrapiHomepageResponse,
  StrapiRichTextBlock,
} from "../types/strapi-home.types";

const DEFAULT_HERO_TITLE =
  "En WiAuto encuentra el auto ideal para tu próximo destino";
const DEFAULT_HERO_ACTION = {
  label: "Publicar Vehículo",
  url: "/crear-vehiculo",
};
const DEFAULT_NEWSLETTER = {
  subtitle: "Suscríbete al Newsletter",
  title: "Obtenga noticias actualizadas",
  description:
    "Mantente al día con las mejores oportunidades y novedades del sector automotriz.",
};
const DEFAULT_APP = {
  title: "Descarga nuestra app",
  phrase: "Todo lo que necesitas, en la palma de tu mano",
  description:
    "Accede a todas las funcionalidades desde cualquier lugar, de forma rápida y sencilla.",
  google_store_labels: { line1: "GET IT ON", line2: "Google Play" },
  apple_store_labels: { line1: "Download on the", line2: "App Store" },
};
const DEFAULT_FEATURES = {
  title: "WiAuto llega para revolucionar la compra y venta de coches",
  description:
    "Nuestra plataforma conecta a compradores y vendedores en un solo lugar.",
  features: [],
};

const richTextToStoreLabels = (
  blocks: StrapiRichTextBlock[] | null | undefined,
  fallback: { line1: string; line2: string },
): { line1: string; line2: string } => {
  if (!blocks?.length) {
    return fallback;
  }

  const lines = blocks
    .filter((block) => block.type === "paragraph" && block.children?.length)
    .map((block) =>
      block.children!.map((child) => child.text).join("").trim(),
    )
    .filter(Boolean);

  return {
    line1: lines[0] ?? fallback.line1,
    line2: lines[1] ?? fallback.line2,
  };
};

type StrapiHomeHero = NonNullable<StrapiHomepageResponse["data"]>["homeHero"];

const pickBackgroundImageUrl = (hero?: StrapiHomeHero): string | null => {
  const media = hero?.backgroundImage;
  if (!media) {
    return null;
  }
  return (
    getStrapiMediaUrl(media.formats?.large?.url) ??
    getStrapiMediaUrl(media.formats?.medium?.url) ??
    getStrapiMediaUrl(media.url)
  );
};

export const mapHomePageData = (
  response: StrapiHomepageResponse,
): HomePageData => {
  const data = response.data;
  const hero = data?.homeHero;
  const newsletter = data?.homeNewsletter;
  const app = data?.homeAppAdvertisment;
  const features_block = data?.homeFeatures;
  const seo = data?.homeSeo;

  return {
    hero: {
      title: hero?.title?.trim() || DEFAULT_HERO_TITLE,
      subtitle: hero?.subtitle?.trim() ?? null,
      background_image_url: pickBackgroundImageUrl(hero ?? undefined),
      action_links:
        hero?.actionLinks?.map((link) => ({
          label: link.label,
          url: link.url,
        })) ?? [DEFAULT_HERO_ACTION],
    },
    newsletter: {
      subtitle: newsletter?.subtitle?.trim() || DEFAULT_NEWSLETTER.subtitle,
      title: newsletter?.title?.trim() || DEFAULT_NEWSLETTER.title,
      description:
        newsletter?.description?.trim() || DEFAULT_NEWSLETTER.description,
    },
    app_advertisement: {
      title: app?.title?.trim() || DEFAULT_APP.title,
      phrase: app?.phrase?.trim() || DEFAULT_APP.phrase,
      description: app?.description?.trim() || DEFAULT_APP.description,
      app_mockup_url: getStrapiMediaUrl(app?.appMockup?.url),
      google_store_labels: richTextToStoreLabels(
        app?.googleLabel,
        DEFAULT_APP.google_store_labels,
      ),
      apple_store_labels: richTextToStoreLabels(
        app?.appleLabel,
        DEFAULT_APP.apple_store_labels,
      ),
    },
    features: {
      title: features_block?.title?.trim() || DEFAULT_FEATURES.title,
      description:
        features_block?.description?.trim() || DEFAULT_FEATURES.description,
      features:
        features_block?.feature?.map((item) => ({
          id: String(item.id),
          label: item.label,
          icon_url: getStrapiMediaUrl(item.icon?.url),
          icon_alt: item.icon?.alternativeText ?? item.label,
        })) ?? DEFAULT_FEATURES.features,
    },
    seo: {
      meta_title: seo?.metaTitle?.trim() || "WiAuto",
      meta_description:
        seo?.metaDescription?.trim() ||
        "Compra y vende vehículos en WiAuto.",
      keywords: seo?.keywords?.trim() ?? null,
      canonical_url: seo?.canonicalURL?.trim() ?? null,
      no_index: Boolean(seo?.noIndex),
      share_image_url: getStrapiMediaUrl(seo?.shareImage?.url),
    },
  };
};
