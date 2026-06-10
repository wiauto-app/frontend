
import { PolicyPageTemplate } from "../components/policyPageTemplate";
import { cookiesService } from "../services/cookiesService";

export default async function CookiesPolicyPage() {
  const cookiesPolicy = await cookiesService.getCookiesPolicy();
  
  return (
    <PolicyPageTemplate title={cookiesPolicy.titulo} content={cookiesPolicy.contenido} />
  );
}