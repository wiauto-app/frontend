export type PressPublisher = {
  name: string;
  image_url: string | null;
};

export type PressListItem = {
  document_id: string;
  title: string;
  summary: string;
  image_url: string | null;
  published_at: string | null;
  is_featured: boolean;
  publisher: PressPublisher | null;
  reading_time: string | null;
  url: string;
};

export type PressPaginatedResult = {
  items: PressListItem[];
  pagination: {
    page: number;
    page_size: number;
    page_count: number;
    total: number;
  };
};

export type FindAllPressParams = {
  page?: number;
  page_size?: number;
  is_featured?: boolean;
};
