import { getStrapiData } from "@/lib/strapi-api"
import { BlocksContent } from "@strapi/blocks-react-renderer";


export const privacyService = {
  getPrivacyPolicy: async () => {
    const response = await getStrapiData<{ data: { title: string, content: BlocksContent } }>("/privacy-policy");
    return response.data;
  }
}