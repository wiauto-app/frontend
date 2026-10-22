import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPageTemplate } from "../components/policyPageTemplate";
import { legalPageService } from "../services/legalPageService";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Wiauto",
  description: "Términos y Condiciones | Wiauto",
};

export default async function TermsOfServicePage() {
  const termsOfService = await legalPageService.getBySlug("terminos");

  if (!termsOfService) {
    notFound();
  }

  return (
    <PolicyPageTemplate
      title={termsOfService.titulo}
      content={termsOfService.contenido}
    />
  );
}
