import { newsService } from "@/app/(landing)/noticias/services/newsService";
import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";

import { RelatedNewsGrid } from "./RelatedNewsGrid";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";

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
    <SectionContainer>
      <SectionHeading
        lead="Novedades del"
        highlight="mundo de la automoción"
        animated
      />
      <RelatedNewsGrid items={items} />
    </SectionContainer>
  );
}
