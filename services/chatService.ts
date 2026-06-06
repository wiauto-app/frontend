import {
  ApiResponse,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api";
import type {
  ChatItem,
  ChatListItem,
  ChatMessageListItem,
  ChatMessageMetadata,
  ChatUnreadTotalResult,
  CreateChatDto,
  MarkChatMessagesReadResult,
  PaginatedResult,
  SendChatMessageDto,
} from "@/interfaces/chat.interface";
import { CHAT_TYPE } from "@/interfaces/chat.interface";

const V1_CHATS = "/v1/chats";
const V1_CHAT_MESSAGES = "/v1/chat-messages";

type FindAllChatsParams = {
  page?: number;
  limit?: number;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
  search?: string;
};

type FindMessagesParams = {
  page?: number;
  limit?: number;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
};

export const unwrapChatResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.ok || response.data === null || response.data === undefined) {
    throw new Error(response.message || "Error en la petición de chat");
  }
  return response.data;
};

export const chatService = {
  findAll: async (
    params?: FindAllChatsParams,
  ): Promise<ApiResponse<PaginatedResult<ChatListItem>>> => {
    return apiGet<PaginatedResult<ChatListItem>>(V1_CHATS, {
      page: params?.page ?? 1,
      limit: params?.limit ?? 30,
      order_by: params?.order_by,
      order_direction: params?.order_direction ?? "DESC",
      search: params?.search,
    });
  },

  create: async (data: CreateChatDto): Promise<ApiResponse<ChatItem>> => {
    return apiPost<ChatItem>(V1_CHATS, {
      participants: data.participants,
      vehicle_id: data.vehicle_id,
      chat_type: data.chat_type ?? CHAT_TYPE.INDIVIDUAL,
    });
  },

  findMessages: async (
    chatId: string,
    params?: FindMessagesParams,
  ): Promise<ApiResponse<PaginatedResult<ChatMessageListItem>>> => {
    return apiGet<PaginatedResult<ChatMessageListItem>>(
      `${V1_CHATS}/${chatId}/messages`,
      {
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
        order_by: params?.order_by ?? "created_at",
        order_direction: params?.order_direction ?? "ASC",
      },
    );
  },

  sendMessage: async (
    chatId: string,
    body: SendChatMessageDto,
  ): Promise<ApiResponse<ChatMessageListItem>> => {
    return apiPost<ChatMessageListItem>(`${V1_CHATS}/${chatId}/messages`, body);
  },

  updateMessage: async (
    messageId: string,
    body: { content?: string; metadata?: ChatMessageMetadata },
  ): Promise<ApiResponse<ChatMessageListItem>> => {
    return apiPatch<ChatMessageListItem>(`${V1_CHAT_MESSAGES}/${messageId}`, body);
  },

  deleteMessage: async (messageId: string): Promise<ApiResponse<null>> => {
    return apiDelete<null>(`${V1_CHAT_MESSAGES}/${messageId}`);
  },

  markAsRead: async (
    chatId: string,
    lastMessageId?: string,
  ): Promise<ApiResponse<MarkChatMessagesReadResult>> => {
    return apiPost<MarkChatMessagesReadResult>(
      `${V1_CHATS}/${chatId}/read`,
      lastMessageId ? { last_message_id: lastMessageId } : {},
    );
  },

  getUnreadTotal: async (): Promise<ApiResponse<ChatUnreadTotalResult>> => {
    return apiGet<ChatUnreadTotalResult>(`${V1_CHATS}/unread-total`);
  },
};
