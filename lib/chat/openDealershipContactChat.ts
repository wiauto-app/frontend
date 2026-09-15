import {
  CHAT_MESSAGE_TYPE,
  CHAT_TYPE,
  type ChatListItem,
} from "@/interfaces/chat.interface";
import { chatService } from "@/services/chatService";

interface OpenDealershipContactChatParams {
  dealerProfileId: string;
  dealerName: string;
  message?: string;
}

const findExistingChat = (
  chats: ChatListItem[],
  dealerProfileId: string,
): ChatListItem | undefined =>
  chats.find(
    (chat) =>
      chat.chat_type === CHAT_TYPE.INDIVIDUAL &&
      chat.vehicle_id === null &&
      chat.other_participants.some(
        (participant) => participant.id === dealerProfileId,
      ),
  );

const fetchAllChats = async (): Promise<ChatListItem[]> => {
  const response = await chatService.findAll({ page: 1, limit: 100 });
  if (!response.ok || !response.data) {
    throw new Error(response.message || "No se pudieron cargar los chats");
  }
  return response.data.data;
};

export const openDealershipContactChat = async ({
  dealerProfileId,
  dealerName,
  message,
}: OpenDealershipContactChatParams): Promise<{ chat_id: string }> => {
  let chats = await fetchAllChats();
  let existingChat = findExistingChat(chats, dealerProfileId);

  if (!existingChat) {
    const createResponse = await chatService.create({
      participants: [dealerProfileId],
      vehicle_id: null,
      chat_type: CHAT_TYPE.INDIVIDUAL,
    });

    if (createResponse.status === 409) {
      chats = await fetchAllChats();
      existingChat = findExistingChat(chats, dealerProfileId);
    } else if (!createResponse.ok || !createResponse.data) {
      throw new Error(createResponse.message || "No se pudo crear el chat");
    } else {
      existingChat = {
        id: createResponse.data.id,
        chat_type: createResponse.data.chat_type,
        vehicle_id: createResponse.data.vehicle_id,
        ticket_id: createResponse.data.ticket_id ?? null,
        ticket: null,
        created_at: createResponse.data.created_at,
        updated_at: createResponse.data.updated_at,
        other_participants: [],
        unread_count: 0,
        last_message_preview: null,
        last_message_at: null,
        last_message_type: null,
      };
    }
  }

  if (!existingChat) {
    throw new Error("No se encontró el chat del concesionario");
  }

  const content =
    message?.trim() ||
    `Hola, me gustaría recibir más información sobre ${dealerName}.`;
  const messageResponse = await chatService.sendMessage(existingChat.id, {
    content,
    type: CHAT_MESSAGE_TYPE.TEXT,
  });

  if (!messageResponse.ok) {
    throw new Error(messageResponse.message || "No se pudo enviar el mensaje");
  }

  return { chat_id: existingChat.id };
};
