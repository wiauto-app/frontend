import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPageTemplate } from "../components/policyPageTemplate";
import { legalPageService } from "../services/legalPageService";

export const metadata: Metadata = {
  title: "Política de Privacidad | Wiauto",
  description: "Política de Privacidad | Wiauto",
};

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await legalPageService.getBySlug("privacidad");

  if (!privacyPolicy) {
    notFound();
  }

  return (
    <PolicyPageTemplate
      title={privacyPolicy.titulo}
      content={privacyPolicy.contenido}
    />
  );
}
