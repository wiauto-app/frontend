import type { NewsCategory } from "../types/news.types";
import { NewsCategoryButton } from "./NewsCategoryButton";

type NewsCategoriesProps = {
  categories: NewsCategory[];
  activeCategorySlug?: string;
};

export const NewsCategories = ({
  categories,
  activeCategorySlug,
}: NewsCategoriesProps) => {
  return (
    <div className="mb-10 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      <NewsCategoryButton
        slug={null}
        label="Todas"
        isActive={!activeCategorySlug}
      />
      {categories.map((category) => (
        <NewsCategoryButton
          key={category.document_id}
          slug={category.slug}
          label={category.name}
          isActive={activeCategorySlug === category.slug}
        />
      ))}
    </div>
  );
};
