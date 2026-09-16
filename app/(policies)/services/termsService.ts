import { getStrapiData } from "@/lib/strapi-api";
import { PolicyData } from "../interfaces/policies.interface";
import { POLICIES_REVALIDATE_TIME } from "../components/constants/policies.constants";


export const termsService = {
  getTermsOfService: async () => {
    const response = await getStrapiData<{ data: PolicyData }>("/pagina-termino",{
      revalidate: POLICIES_REVALIDATE_TIME,
    });
    return response.data;
  }
}