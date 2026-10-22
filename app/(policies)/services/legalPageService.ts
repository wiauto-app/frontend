import { getStrapiData, type StrapiResponse } from "@/lib/strapi-api";
import { POLICIES_REVALIDATE_TIME } from "../components/constants/policies.constants";
import type { LegalPage } from "../interfaces/policies.interface";

export const legalPageService = {
  getBySlug: async (slug: string): Promise<LegalPage | null> => {
    const searchParams = new URLSearchParams();
    searchParams.set("filters[slug][$eq]", slug);
    searchParams.set("pagination[pageSize]", "1");

    const response = await getStrapiData<StrapiResponse<LegalPage[]>>(
      `/pagina-legales?${searchParams.toString()}`,
      { revalidate: POLICIES_REVALIDATE_TIME },
    );

    return response.data[0] ?? null;
  },
};
