import type { Metadata } from "next";

import { PlansContactSection } from "./components/PlansContactSection";
import { PlansFeaturesSection } from "./components/PlansFeaturesSection";
import { PlansHeroSection } from "./components/PlansHeroSection";
import { PlansPricingSection } from "./components/PlansPricingSection";
import { PlansStepsSection } from "./components/PlansStepsSection";
import { getPlansData } from "./services/getPlansData";
import { getPublicPlansCatalog } from "./services/getPublicPlansCatalog.server";
import { LandingContainer } from "@/components/ui/landingContainer";

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
  const [cms_result, plans_result] = await Promise.allSettled([
    getPlansData(),
    getPublicPlansCatalog(),
  ]);

  const cms = cms_result.status === "fulfilled" ? cms_result.value : null;
  const plans = plans_result.status === "fulfilled" ? plans_result.value : [];
  const catalog_error = plans_result.status === "rejected";
  if (!cms && catalog_error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-20 text-center text-slate-600">
        No se pudo cargar la información de planes. Inténtalo de nuevo más
        tarde.
      </div>
    );
  }

  return (
    <LandingContainer>
      {cms?.hero ? <PlansHeroSection hero={cms.hero} /> : null}
      {cms?.action_call_section ? (
        <PlansPricingSection
          actionCallSection={cms.action_call_section}
          plans={plans}
          catalogError={catalog_error}
        />
      ) : null}

      {cms?.ventajas ? <PlansFeaturesSection data={cms.ventajas} /> : null}

      {cms?.facil_vender ? (
        <PlansStepsSection data={cms.facil_vender} />
      ) : null}

      {cms?.contact ? <PlansContactSection data={cms.contact} /> : null}
    </LandingContainer>
  );
}
