import { termsService } from "../services/termsService";
import { PolicyPageTemplate } from "../components/policyPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Wiauto",
  description: "Términos y Condiciones | Wiauto",
};

export default async function TermsOfServicePage() {
  const termsOfService = await termsService.getTermsOfService();

  return <PolicyPageTemplate title={termsOfService.titulo} content={termsOfService.contenido} />
}
