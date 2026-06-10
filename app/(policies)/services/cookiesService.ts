import { getStrapiData } from "@/lib/strapi-api";
import { PolicyData } from "../interfaces/policies.interface";


export const cookiesService = {
  getCookiesPolicy: async () => {
    const response = await getStrapiData<{ data: PolicyData }>("/pagina-cookie");
    return response.data;
  }
}