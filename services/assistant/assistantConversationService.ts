import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  type ApiResponse,
} from "@/lib/api";
import type { UIMessage } from "ai";

const V1_ASSISTANT_CONVERSATIONS = "/v1/assistant/conversations";

export interface AssistantConversationListItem {
  id: string;
  title: string;
  updated_at: string;
}

export interface AssistantConversation extends AssistantConversationListItem {
  messages: UIMessage[];
  created_at: string;
}

const unwrapResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.ok || response.data === null || response.data === undefined) {
    throw new Error(response.message || "Error en la petición del asistente");
  }

  return response.data;
};

export const assistantConversationService = {
  findAll: async (): Promise<AssistantConversationListItem[]> => {
    const response = await apiGet<AssistantConversationListItem[]>(
      V1_ASSISTANT_CONVERSATIONS,
    );
    return unwrapResponse(response);
  },

  create: async (): Promise<AssistantConversation> => {
    const response = await apiPost<AssistantConversation>(
      V1_ASSISTANT_CONVERSATIONS,
      {},
    );
    return unwrapResponse(response);
  },

  findOne: async (conversationId: string): Promise<AssistantConversation> => {
    const response = await apiGet<AssistantConversation>(
      `${V1_ASSISTANT_CONVERSATIONS}/${conversationId}`,
    );
    return unwrapResponse(response);
  },

  remove: async (conversationId: string): Promise<void> => {
    const response = await apiDelete(
      `${V1_ASSISTANT_CONVERSATIONS}/${conversationId}`,
    );
    unwrapResponse(response);
  },

  updateTitle: async (
    conversationId: string,
    title: string,
  ): Promise<AssistantConversationListItem> => {
    const response = await apiPatch<AssistantConversationListItem>(
      `${V1_ASSISTANT_CONVERSATIONS}/${conversationId}`,
      { title },
    );
    return unwrapResponse(response);
  },
};
