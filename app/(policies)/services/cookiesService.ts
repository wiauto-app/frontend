import { getStrapiData } from "@/lib/strapi-api";
import { BlocksContent } from "@strapi/blocks-react-renderer";


export const cookiesService = {
  getCookiesPolicy: async () => {
    const response = await getStrapiData<{ data: { title: string, content: BlocksContent } }>("/cookies-policy");
    return response.data;
  }
}