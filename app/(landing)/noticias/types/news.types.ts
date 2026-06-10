import type { StrapiBlock } from "./strapi-news.types";
import type { StrapiSeoComponent } from "@/lib/strapi.types";

export type NewsCategory = {
  document_id: string;
  name: string;
  slug: string;
};

export type NewsComment = {
  document_id: string;
  name: string | null;
  email: string | null;
  text: string | null;
};

export type NewsPublisher = {
  name: string;
  image_url: string | null;
};

export type NewsBanner = {
  id: number;
  url: string;
  alternative_text: string | null;
};

export type NewsListItem = {
  document_id: string;
  title: string;
  slug: string;
  summary: string;
  is_featured: boolean;
  banner_url: string | null;
  category: NewsCategory | null;
  published_at: string | null;
  created_at: string | null;
  comments_count: number;
};

export type NewsDetail = NewsListItem & {
  content: StrapiBlock[];
  banners: NewsBanner[];
  seo: StrapiSeoComponent | null;
  publisher: NewsPublisher | null;
  comments: NewsComment[];
  citation: string | null;
  updated_at: string | null;
};

export type NewsPaginatedResult = {
  items: NewsListItem[];
  pagination: {
    page: number;
    page_size: number;
    page_count: number;
    total: number;
  };
};

export type FindAllNewsParams = {
  page?: number;
  page_size?: number;
  is_featured?: boolean;
  category_slug?: string;
};

export type FindOneNewsParams =
  | { document_id: string; slug?: never }
  | { slug: string; document_id?: never };
