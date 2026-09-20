import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FeaturesSection } from "@/components/landings/FeaturesSection";
import { ContentSection } from "@/components/landings/ContentSection";
import { DynamicContentSection } from "@/components/landings/DynamicContentSection";
import { StrapiActionProvider } from "@/components/strapi-actions/strapi-action-context";
import { getColaboracionBySlug } from "@/services/colaboracionesService";
import { LandingContainer } from "@/components/ui/landingContainer";
import { CollabsHeroSection } from "../components/collabsHeroSection";

interface ColaboracionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: ColaboracionDetailPageProps): Promise<Metadata> => {
  const { slug } = await params;
  try {
    const colaboracion = await getColaboracionBySlug(slug);
    if (!colaboracion) {
      return { title: "Colaboración" };
    }

    return {
      title: `${colaboracion.nombre} | WiAuto`,
      description:
        colaboracion.hero?.descripcion ??
        `Colaboración con ${colaboracion.nombre}`,
    };
  } catch {
    return { title: "Colaboración" };
  }
};

export default async function ColaboracionDetailPage({
  params,
}: ColaboracionDetailPageProps) {
  const { slug } = await params;
  let colaboracion;
  try {
    colaboracion = await getColaboracionBySlug(slug);
  } catch {
    notFound();
  }

  if (!colaboracion) {
    notFound();
  }

  return (
    <StrapiActionProvider actionKey={colaboracion.key}>
      <LandingContainer>
        {/* Hero Section */}
        {colaboracion.hero && <CollabsHeroSection hero={colaboracion.hero} />}

        {/* Features/Characteristics Section */}
        {colaboracion.caracteristicas && (
          <FeaturesSection data={colaboracion.caracteristicas} />
        )}

        {/* Content Section — editorial split */}
        {colaboracion.contenido && (
          <ContentSection content={colaboracion.contenido} variant="split" />
        )}

        {/* Dynamic Content Blocks */}
        {colaboracion.contenido_dinamico && (
          <DynamicContentSection blocks={colaboracion.contenido_dinamico} />
        )}

        {/* Extra Content Section — brand band */}
        {colaboracion.contenido_extra && (
          <ContentSection
            content={colaboracion.contenido_extra}
            variant="band"
          />
        )}
      </LandingContainer>
    </StrapiActionProvider>
  );
}
