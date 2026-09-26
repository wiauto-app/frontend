import type { Metadata } from "next";

import { PlansContactSection } from "./components/PlansContactSection";
import { PlansFeaturesSection } from "./components/PlansFeaturesSection";
import { PlansHeroSection } from "./components/PlansHeroSection";
import { PlansPricingSection } from "./components/PlansPricingSection";
import { PlansStepsSection } from "./components/PlansStepsSection";
import { getPlansData } from "./services/getPlansData";
import { getPublicPlansCatalog } from "./services/getPublicPlansCatalog.server";
import { LandingContainer } from "@/components/ui/landingContainer";
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi-media";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cms = await getPlansData();

    return {
      title: cms?.hero?.titulo ?? "Planes profesionales | WiAuto",
      description:
        cms?.hero?.descripcion ??
        "Descubre los planes profesionales de WiAuto para impulsar tu negocio de la automoción.",
    };
  } catch {
    return {
      title: "Planes profesionales | WiAuto",
      description:
        "Descubre los planes profesionales de WiAuto para impulsar tu negocio de la automoción.",
    };
  }
}

export default async function Page() {
  const [cms_result, plans_result] = await Promise.all([
    getPlansData(),
    getPublicPlansCatalog(),
  ]);

  const cms = cms_result ?? null;
  const plans = plans_result ?? [];
  const wiauto_match_image =
    getStrapiImageUrl(cms?.wiauto_match, "large") ?? "";
  return (
    <LandingContainer>
      {cms?.hero ? <PlansHeroSection hero={cms.hero} /> : null}
      {cms?.action_call_section ? (
        <PlansPricingSection
          actionCallSection={cms.action_call_section}
          plans={plans}
        />
      ) : null}
      {wiauto_match_image ? (
        <Image
          src={wiauto_match_image}
          alt="Wiauto Match"
          className="mx-auto"
          width={1000}
          height={1000}
        />
      ) : null}
      {cms?.ventajas ? <PlansFeaturesSection data={cms.ventajas} /> : null}

      {cms?.facil_vender ? <PlansStepsSection data={cms.facil_vender} /> : null}

      {cms?.contact ? <PlansContactSection data={cms.contact} /> : null}
    </LandingContainer>
  );
}
