import { getStrapiData } from "@/lib/strapi-api";
import { BlocksContent } from "@strapi/blocks-react-renderer";


export const termsService = {
  getTermsOfService: async () => {
    const response = await getStrapiData<{ data: { title: string, content: BlocksContent } }>("/terms-and-condition");
    return response.data;
  }
}