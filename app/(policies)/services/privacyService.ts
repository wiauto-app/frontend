import { getStrapiData } from "@/lib/strapi-api"
import { PolicyData } from "../interfaces/policies.interface";
import { POLICIES_REVALIDATE_TIME } from "../components/constants/policies.constants";


export const privacyService = {
  getPrivacyPolicy: async () => {
    const response = await getStrapiData<{ data: PolicyData }>("/pagina-politica",{
      revalidate: POLICIES_REVALIDATE_TIME,
    });
    return response.data;
  }
}