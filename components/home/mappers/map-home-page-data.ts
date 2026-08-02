import type { StrapiLink } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type {
  HomeLowEmissionsData,
  HomePageData,
  HomeProcessSectionData,
  HomeProcessTab,
  StrapiCard,
} from "../types/home-page.types";
import type {
  StrapiHomepageResponse,
  StrapiMedia,
  StrapiRichTextBlock,
} from "../types/strapi-home.types";

const DEFAULT_HERO_TITLE =
  "En WiAuto encuentra el coche ideal para tu próximo destino";
const DEFAULT_HERO_ACTION: StrapiLink = {
  id: 0,
  label: "Publicar vehículo",
  url: "/crear-vehiculo",
  destacado: null,
  imagen: null,
};
const DEFAULT_NEWSLETTER = {
  subtitle: "Suscríbete al boletín",
  title: "Recibe noticias actualizadas",
  description:
    "Mantente al día con las mejores oportunidades y novedades del sector de la automoción.",
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

const plainTextToBlocks = (text: string): StrapiRichTextBlock[] => [
  {
    type: "paragraph",
    children: [{ type: "text", text }],
  },
];

const DEFAULT_PROCESS_TITLE: StrapiRichTextBlock[] = [
  {
    type: "paragraph",
    children: [
      { type: "text", text: "Te acompañamos de tu " },
      { type: "text", text: "experiencia en automoción", bold: true },
    ],
  },
];

const DEFAULT_PROCESS_TABS: HomeProcessTab[] = [
  {
    id: "default-comprar",
    label: "Comprar",
    heading: "Comprar un coche",
    description: plainTextToBlocks(
      "Encuentra el vehículo ideal según tus necesidades, presupuesto y estilo de vida. Explora opciones, compara modelos y toma una decisión con mayor confianza.",
    ),
    image_url: null,
    image_alt: null,
  },
  {
    id: "default-vender",
    label: "Vender",
    heading: "Vender tu coche",
    description: plainTextToBlocks(
      "Publica tu vehículo en minutos, llega a miles de compradores interesados y gestiona consultas desde un solo lugar con herramientas pensadas para vendedores.",
    ),
    image_url: null,
    image_alt: null,
  },
  {
    id: "default-comparar",
    label: "Comparar",
    heading: "Comparar modelos",
    description: plainTextToBlocks(
      "Analiza características, precios y valoraciones de distintos vehículos en un solo lugar para elegir la opción que mejor se adapte a ti.",
    ),
    image_url: null,
    image_alt: null,
  },
  {
    id: "default-guias",
    label: "Guías y consejos",
    heading: "Guías y consejos",
    description: plainTextToBlocks(
      "Accede a artículos, guías y recomendaciones del sector de la automoción para tomar decisiones informadas en cada etapa del proceso.",
    ),
    image_url: null,
    image_alt: null,
  },
];

const DEFAULT_PROCESS_SECTION: HomeProcessSectionData = {
  title: DEFAULT_PROCESS_TITLE,
  tabs: DEFAULT_PROCESS_TABS,
};

const DEFAULT_LOW_EMISSIONS: HomeLowEmissionsData = {
  title: "Encuentra tu vehículo de bajas emisiones",
  description:
    "Explora las opciones más eficientes para moverte mejor y cuidar del planeta",
  image_url: null,
  links: [],
};

const pickMediaUrl = (media?: StrapiMedia | null): string | null => {
  if (!media) {
    return null;
  }

  return (
    getStrapiMediaUrl(media.formats?.large?.url) ??
    getStrapiMediaUrl(media.formats?.medium?.url) ??
    getStrapiMediaUrl(media.url)
  );
};

const mapProcessSection = (
  process_section?: NonNullable<StrapiHomepageResponse["data"]>["processSection"],
): HomeProcessSectionData => {
  if (!process_section) {
    return DEFAULT_PROCESS_SECTION;
  }

  const title =
    process_section.titulo?.length ? process_section.titulo : DEFAULT_PROCESS_TITLE;

  const tabs =
    process_section.tabs
      ?.filter((tab) => tab.tab?.trim() && tab.titulo?.trim())
      .map((tab) => ({
        id: String(tab.id),
        label: tab.tab!.trim(),
        heading: tab.titulo!.trim(),
        description:
          tab.descripcion?.length ?
            tab.descripcion
          : plainTextToBlocks(""),
        image_url: pickMediaUrl(tab.image),
        image_alt: tab.image?.alternativeText ?? tab.titulo!.trim(),
      })) ?? [];

  return {
    title,
    tabs: tabs.length > 0 ? tabs : DEFAULT_PROCESS_TABS,
  };
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

const mapLowEmissions = (
  low_emissions?: NonNullable<StrapiHomepageResponse["data"]>["bajas_emisiones"],
): HomeLowEmissionsData => {
  if (!low_emissions) {
    return DEFAULT_LOW_EMISSIONS;
  }

  return {
    title:
      low_emissions.header?.titulo?.trim() || DEFAULT_LOW_EMISSIONS.title,
    description:
      low_emissions.header?.descripcion?.trim() ||
      DEFAULT_LOW_EMISSIONS.description,
    image_url: pickMediaUrl(low_emissions.imagen),
    links:
      low_emissions.links?.flatMap((item) => {
        const title = item.titulo?.trim();
        const href = item.boton?.url?.trim();
        if (!title || !href) {
          return [];
        }

        return [
          {
            title,
            description: item.descripcion?.trim() ?? "",
            href,
            image_url: pickMediaUrl(item.imagen),
            border_color: item.colorFondo?.trim() ?? "",
            title_color: item.colorTexto?.trim() ?? "",
          },
        ];
      }) ?? [],
  };
};

const mapHerramientas = (
  herramientas?: NonNullable<StrapiHomepageResponse["data"]>["herramientas"],
): StrapiCard[] => {
  if (!herramientas?.length) {
    return [];
  }

  return herramientas.flatMap((item) => {
    if (!item.titulo?.trim() || !item.imagen || !item.boton || !item.colorFondo) {
      return [];
    }

    return [
      {
        titulo: item.titulo,
        descripcion: item.descripcion ?? "",
        imagen: item.imagen,
        colorFondo: item.colorFondo,
        colorTexto: item.colorTexto ?? undefined,
        boton: item.boton,
      },
    ];
  });
};

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
  const process_section = data?.processSection;
  const herramientas = data?.herramientas;
  const low_emissions = data?.bajas_emisiones;
  return {
    herramientas: mapHerramientas(herramientas ?? undefined),
    low_emissions: mapLowEmissions(low_emissions ?? undefined),
    hero: {
      title: hero?.title?.trim() || DEFAULT_HERO_TITLE,
      subtitle: hero?.subtitle?.trim() ?? null,
      download_app_label: hero?.descarga_app?.trim() ?? null,
      background_image_url: pickBackgroundImageUrl(hero ?? undefined),
      hero_images:
        hero?.heroImages
          ?.slice()
          .sort((a, b) => a.order - b.order)
          .map((item) => {
            const image_url = pickMediaUrl(item.image);
            if (!image_url) {
              return null;
            }

            return {
              id: String(item.id),
              image_url,
              image_alt: item.alt?.trim() || item.image?.alternativeText || "",
              order: item.order,
              active: item.active,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null) ?? [],
      action_links:
        hero?.actionLinks?.length ? hero.actionLinks : [DEFAULT_HERO_ACTION],
      features:
        hero?.caracteristicas
          ?.filter((item) => item.label?.trim())
          .map((item) => ({
            id: String(item.id),
            label: item.label.trim(),
            description: item.descripcion?.trim() ?? null,
            icon_url: getStrapiMediaUrl(item.icon?.url),
            icon_alt: item.icon?.alternativeText ?? item.label.trim(),
          })) ?? [],
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
    process_section: mapProcessSection(process_section ?? undefined),
  };
};
