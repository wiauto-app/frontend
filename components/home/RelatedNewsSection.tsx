import { newsService } from "@/app/(landing)/noticias/services/newsService";
import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { NewCard } from "./newCard";

const HOME_RELATED_NEWS_LIMIT = 4;
const RELATED_NEWS_CATEGORY_SLUG = "novedades";

export async function RelatedNewsSection() {
  let items: NewsListItem[] = [];

  try {
    const result = await newsService.findAll({
      page: 1,
      page_size: HOME_RELATED_NEWS_LIMIT,
      category_slug: RELATED_NEWS_CATEGORY_SLUG,
    });
    items = result.items;
  } catch {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <SectionContainer >
      <SectionHeading
        lead="Novedades del"
        highlight="mundo de la automoción"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[minmax(180px,1fr)] max-h-96">
        {items.map((item, index) => (
          <NewCard
            key={item.document_id}
            item={item}
            variant={index === 0 ? "featured" : "default"}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
