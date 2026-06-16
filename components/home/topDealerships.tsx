import { dealershipService } from "@/services/dealerships/dealershipService";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { TopDealershipsSlider } from "./TopDealershipsSlider";

export const TopDealerships = async () => {
  const result = await dealershipService.findAll({ page: 1, limit: 8 });

  if (!result.data.length) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionHeading lead="Concesionarios" highlight="destacados" />
      <TopDealershipsSlider dealerships={result.data} />
    </SectionContainer>
  );
};
