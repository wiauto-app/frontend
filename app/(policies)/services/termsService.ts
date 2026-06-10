import { getStrapiData } from "@/lib/strapi-api";
import { PolicyData } from "../interfaces/policies.interface";


export const termsService = {
  getTermsOfService: async () => {
    const response = await getStrapiData<{ data: PolicyData }>("/pagina-termino");
    return response.data;
  }
}