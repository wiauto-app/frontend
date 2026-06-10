import { privacyService } from "../services/privacyService";
import { PolicyPageTemplate } from "../components/policyPageTemplate";

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await privacyService.getPrivacyPolicy();

  return (
    <PolicyPageTemplate title={privacyPolicy.title} content={privacyPolicy.content} />
  );
}