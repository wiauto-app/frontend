import { getStrapiData } from "@/lib/strapi-api";
import {
  createDefaultFooterData,
  mapFooterData,
} from "../mappers/map-footer-data";
import type { FooterData } from "../types/footer.types";
import type { StrapiFooterResponse } from "../types/strapi-footer.types";

const FOOTER_REVALIDATE_SECONDS = 86400;

const FOOTER_POPULATE_QUERY = `
/footer
?populate[logo]=true
&populate[redesSociales][populate][imagen]=true
&populate[sections][populate][links][populate][imagen]=true
`.replace(/\s/g, "");

export const getFooterData = async (): Promise<FooterData> => {
  try {
    const response = await getStrapiData<StrapiFooterResponse>(
      FOOTER_POPULATE_QUERY,
      { revalidate: FOOTER_REVALIDATE_SECONDS },
    );
    return mapFooterData(response);
  } catch (error) {
    console.error(error);
    return createDefaultFooterData();
  }
};
