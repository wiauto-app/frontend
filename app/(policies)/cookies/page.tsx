import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPageTemplate } from "../components/policyPageTemplate";
import { legalPageService } from "../services/legalPageService";

export const metadata: Metadata = {
  title: "Política de Cookies | Wiauto",
  description: "Política de Cookies | Wiauto",
};

export default async function CookiesPolicyPage() {
  const cookiesPolicy = await legalPageService.getBySlug("cookies");

  if (!cookiesPolicy) {
    notFound();
  }

  return (
    <PolicyPageTemplate
      title={cookiesPolicy.titulo}
      content={cookiesPolicy.contenido}
    />
  );
}
