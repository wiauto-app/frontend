import { getStrapiData, postStrapiData } from "@/lib/strapi-api";
import { mapComment, mapCommentsPaginated } from "../mappers/map-comment";
import type {
  Comment,
  CommentsPaginatedResult,
  CreateCommentInput,
  FindAllCommentsParams,
  FindOneCommentParams,
} from "../types/comment.types";
import type {
  CreateCommentStrapiBody,
  StrapiCommentSingleResponse,
  StrapiCommentsListResponse,
} from "../types/strapi-comment.types";

const COMMENT_POPULATE = "populate[noticia]=true";

const buildFindAllQuery = (params?: FindAllCommentsParams): string => {
  const search_params = new URLSearchParams();
  search_params.set("sort", "createdAt:desc");
  search_params.append("pagination[page]", String(params?.page ?? 1));
  search_params.append("pagination[pageSize]", String(params?.page_size ?? 25));

  if (params?.news_document_id) {
    search_params.append(
      "filters[noticia][documentId][$eq]",
      params.news_document_id,
    );
  }

  search_params.append("populate[noticia]", "true");
  return search_params.toString();
};

export const commentService = {
  findAll: async (
    params?: FindAllCommentsParams,
  ): Promise<CommentsPaginatedResult> => {
    const query = buildFindAllQuery(params);
    const response = await getStrapiData<StrapiCommentsListResponse>(
      `/comentarios?${query}`,
    );
    return mapCommentsPaginated(response);
  },

  findOne: async (params: FindOneCommentParams): Promise<Comment> => {
    const response = await getStrapiData<StrapiCommentSingleResponse>(
      `/comentarios/${params.document_id}?${COMMENT_POPULATE}`,
    );
    return mapComment(response.data);
  },

  create: async (input: CreateCommentInput): Promise<Comment> => {
    const body: CreateCommentStrapiBody = {
      nombre: input.name.trim(),
      email: input.email.trim(),
      comentario: input.text.trim(),
      noticia: {
        connect: input.news_document_id,
      },
    };

    const response = await postStrapiData<
      StrapiCommentSingleResponse,
      CreateCommentStrapiBody
    >(`/comentarios?${COMMENT_POPULATE}`, { data: body });

    return mapComment(response.data);
  },
};
