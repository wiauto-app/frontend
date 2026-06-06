import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { BRAND_BLUE_LIGHT } from "./data/home-data";
import { categoriesService } from "./services/categoriesService";
import { CarTypeCard } from "./carTypeCard";

export async function CarTypesSection() {
  const data = await categoriesService.findAll();
  const categories = data.data;
  return (
    <SectionContainer className="pt-0 pb-12 lg:pb-16">
      <div
        className="rounded-3xl px-4 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
        style={{ backgroundColor: BRAND_BLUE_LIGHT }}
      >
        <SectionHeading
          lead="Tipos de"
          highlight="coches"
          className="mb-8 sm:mb-10"
        />

        <div className="flex gap-5 overflow-x-auto  ">
          {categories.map((category) => (
            <CarTypeCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
