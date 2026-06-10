import { getStrapiData } from "@/lib/strapi-api"
import { PolicyData } from "../interfaces/policies.interface";


export const privacyService = {
  getPrivacyPolicy: async () => {
    const response = await getStrapiData<{ data: PolicyData }>("/pagina-politica");
    return response.data;
  }
}