import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { categoriesService } from "./services/categoriesService";
import { PopularCategoriesSlider } from "./PopularCategoriesSlider";

export async function PopularCategoriesGrid() {
  const data = await categoriesService.findAll();
  const categories = data.data ?? [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <SectionContainer className=" flex flex-col ">
      <SectionHeading lead="Categorías" highlight="populares" />
      <PopularCategoriesSlider categories={categories} />
    </SectionContainer>
  );
}
