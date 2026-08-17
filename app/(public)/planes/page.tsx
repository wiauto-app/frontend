import type { Metadata } from "next";

import { PlansFeaturesSection } from "./components/PlansFeaturesSection";
import { PlansFinalCtaSection } from "./components/PlansFinalCtaSection";
import { PlansHeroSection } from "./components/PlansHeroSection";
import { PlansMobileSection } from "./components/PlansMobileSection";
import { PlansPricingSection } from "./components/PlansPricingSection";
import { PlansStatsSection } from "./components/PlansStatsSection";
import { PlansTechSection } from "./components/PlansTechSection";
import { getPlansData } from "./services/getPlansData";
import { getPublicPlansCatalog } from "./services/getPublicPlansCatalog.server";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cms = await getPlansData();

    return {
      title: cms?.hero?.titulo ?? "Planes profesionales | WiAuto",
      description:
        cms?.hero?.descripcion ??
        "Descubre los planes profesionales de WiAuto para impulsar tu negocio automotriz.",
    };
  } catch {
    return {
      title: "Planes profesionales | WiAuto",
      description:
        "Descubre los planes profesionales de WiAuto para impulsar tu negocio automotriz.",
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
        No se pudo cargar la información de planes. Inténtalo de nuevo más tarde.
      </div>
    );
  }

  return (
    <div className="container-custom flex flex-col gap-16">
      {cms?.hero ? <PlansHeroSection hero={cms.hero} /> : null}

      {cms?.estadisticas && cms.estadisticas.length > 0 ? (
        <PlansStatsSection items={cms.estadisticas ?? []} />
      ) : null}

      {cms?.caracteristicas ? <PlansFeaturesSection data={cms.caracteristicas} /> : null}
      {cms?.action_call_section ? <PlansPricingSection actionCallSection={cms.action_call_section} plans={plans} catalogError={catalog_error} /> : null}

      {cms?.tech_add ? <PlansTechSection data={cms.tech_add} /> : null}

      {cms?.mobile_advertisment ? (
        <PlansMobileSection data={cms.mobile_advertisment} />
      ) : null}

      <PlansFinalCtaSection primaryCta={cms?.hero?.acciones?.[0] ?? null} />
    </div>
  );
}
