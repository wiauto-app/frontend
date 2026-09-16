import { privacyService } from "../services/privacyService";
import { PolicyPageTemplate } from "../components/policyPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Wiauto",
  description: "Política de Privacidad | Wiauto",
};

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await privacyService.getPrivacyPolicy();
  return (
    <PolicyPageTemplate title={privacyPolicy.titulo} content={privacyPolicy.contenido} />
  );
}