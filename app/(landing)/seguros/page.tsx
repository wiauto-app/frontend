import type { Metadata } from "next";

import { SegurosHeroSection } from "./components/SegurosHeroSection";
import { SegurosBenefitsSection } from "./components/SegurosBenefitsSection";
import { SegurosSecuritySection } from "./components/SegurosSecuritySection";
import { SegurosPartnersSection } from "./components/SegurosPartnersSection";
import { getSegurosPageData } from "./services/getSegurosPageData";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSegurosPageData();

    return {
      title: content?.hero?.titulo
        ? `${content.hero.titulo} | WiAuto`
        : "Seguros | WiAuto",
      description:
        content?.hero?.descripcion ??
        "Protege tu vehículo con Seguros Confianza. Coberturas integrales, atención 24/7 y trámites 100% online en alianza con WiAuto.",
    };
  } catch {
    return {
      title: "Seguros | WiAuto",
      description:
        "Protege tu vehículo con Seguros Confianza. Coberturas integrales, atención 24/7 y trámites 100% online en alianza con WiAuto.",
    };
  }
}

export default async function SegurosPage() {
  let content = null;

  try {
    content = await getSegurosPageData();
  } catch {
    content = null;
  }

  if (!content) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-20 text-center text-slate-600">
        No se pudo cargar la información de seguros. Inténtalo de nuevo más
        tarde.
      </div>
    );
  }

  return (
    <div className="container-custom mx-auto flex flex-col gap-6">
      <SegurosHeroSection hero={content.hero} />
      <SegurosBenefitsSection data={content.caracteristicas} />
      <SegurosSecuritySection hero={content.seguridad} />
      {/* <SegurosCoverageSection data={content.incluido} /> */}
      {/* <SegurosCtaSection /> */}
      <SegurosPartnersSection data={content.aliados} />
    </div>
  );
}
