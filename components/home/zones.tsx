import { buildProvinceZones } from "@/lib/locations/buildProvinceZones";
import { ProvincesZonesSlider } from "./ProvincesZonesSlider";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";

export const Zones = async () => {
  const provinces = await buildProvinceZones();

  if (provinces.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionHeading lead="Últimos anuncios por" highlight="zona" />
      <ProvincesZonesSlider provinces={provinces} />
    </SectionContainer>
  );
};
