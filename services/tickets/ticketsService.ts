import { apiGet, apiPatch, apiPost, type ApiResponse } from "@/lib/api";
import type { PaginatedResult } from "@/interfaces/chat.interface";
import type {
  CreateTicketPayload,
  TicketCategoryListItem,
  TicketListItem,
  UpdateTicketPayload,
} from "@/interfaces/ticket.interface";

import { V1_TICKET_CATEGORIES, V1_TICKETS } from "./route.constants";

export const ticketsService = {
  create: (
    payload: CreateTicketPayload,
  ): Promise<ApiResponse<TicketListItem>> =>
    apiPost<TicketListItem>(V1_TICKETS, {
      ...payload,
      file_url: payload.file_url?.trim() ? payload.file_url : null,
    }),

  update: (
    id: string,
    payload: UpdateTicketPayload,
  ): Promise<ApiResponse<TicketListItem>> =>
    apiPatch<TicketListItem>(`${V1_TICKETS}/${id}`, payload),

  findCategories: async (): Promise<TicketCategoryListItem[]> => {
    const response = await apiGet<PaginatedResult<TicketCategoryListItem>>(
      `${V1_TICKET_CATEGORIES}?page=1&limit=100&order_by=name&order_direction=ASC`,
    );
    return response.data?.data ?? [];
  },
};
