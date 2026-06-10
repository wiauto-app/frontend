import { termsService } from "../services/termsService";
import { PolicyPageTemplate } from "../components/policyPageTemplate";

export default async function TermsOfServicePage() {
  const termsOfService = await termsService.getTermsOfService();

  return <PolicyPageTemplate title={termsOfService.title} content={termsOfService.content} />
}
