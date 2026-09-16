
import { Metadata } from "next";
import { PolicyPageTemplate } from "../components/policyPageTemplate";
import { cookiesService } from "../services/cookiesService";

export const metadata: Metadata = {
  title: "Política de Cookies | Wiauto",
  description: "Política de Cookies | Wiauto",
};

export default async function CookiesPolicyPage() {
  const cookiesPolicy = await cookiesService.getCookiesPolicy();
  
  return (
    <PolicyPageTemplate title={cookiesPolicy.titulo} content={cookiesPolicy.contenido} />
  );
}