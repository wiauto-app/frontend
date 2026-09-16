import { getStrapiData } from "@/lib/strapi-api";
import { PolicyData } from "../interfaces/policies.interface";
import { POLICIES_REVALIDATE_TIME } from "../components/constants/policies.constants";


export const cookiesService = {
  getCookiesPolicy: async () => {
    const response = await getStrapiData<{ data: PolicyData }>("/pagina-cookie",{
      revalidate: POLICIES_REVALIDATE_TIME,
    });
    return response.data;
  }
}