import { StrapiHero } from "@/interfaces/strapi-components.interface";
import { getStrapiData, StrapiResponse } from "@/lib/strapi-api";
import { HERO_POPULATE } from "@/lib/strapi-populate";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import qs from "qs";


interface ReviewCollabContent {
  card: StrapiHero & { footer: BlocksContent };
}

export const collabsService = {
  getReviewCollabContent: async () => {
    const query = qs.stringify(
      {
        populate: {
          card: HERO_POPULATE,
        },
      },
      {
        encodeValuesOnly: true,
      },
    );
    const response = await getStrapiData<StrapiResponse<ReviewCollabContent>>(
      `/card-revision?${query}`,
    );
    return response.data;
  },
};
