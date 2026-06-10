export type Comment = {
  document_id: string;
  name: string | null;
  email: string | null;
  text: string | null;
  news_document_id: string | null;
  news_title: string | null;
  news_slug: string | null;
  published_at: string | null;
  created_at: string | null;
};

export type CommentsPaginatedResult = {
  items: Comment[];
  pagination: {
    page: number;
    page_size: number;
    page_count: number;
    total: number;
  };
};

export type CreateCommentInput = {
  name: string;
  email: string;
  text: string;
  news_document_id: string;
};

export type FindAllCommentsParams = {
  page?: number;
  page_size?: number;
  news_document_id?: string;
};

export type FindOneCommentParams = {
  document_id: string;
};
