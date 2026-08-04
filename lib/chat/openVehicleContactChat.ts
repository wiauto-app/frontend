import {
  CHAT_MESSAGE_TYPE,
  CHAT_TYPE,
  type ChatListItem,
} from "@/interfaces/chat.interface";
import { chatService } from "@/services/chatService";

const DEFAULT_CONTACT_MESSAGE = "Hola, me interesa este vehículo.";

interface OpenVehicleContactChatParams {
  vehicleId: string;
  publisherId: string;
  message?: string;
}

const findExistingChat = (
  chats: ChatListItem[],
  vehicleId: string,
  publisherId: string,
): ChatListItem | undefined =>
  chats.find(
    (chat) =>
      chat.vehicle_id === vehicleId &&
      chat.other_participants.some((participant) => participant.id === publisherId),
  );

const fetchAllChats = async (): Promise<ChatListItem[]> => {
  const response = await chatService.findAll({ page: 1, limit: 100 });
  if (!response.ok || !response.data) {
    throw new Error(response.message || "No se pudieron cargar los chats");
  }
  return response.data.data;
};

export const openVehicleContactChat = async ({
  vehicleId,
  publisherId,
  message,
}: OpenVehicleContactChatParams): Promise<{ chat_id: string }> => {
  let chats = await fetchAllChats();
  let existingChat = findExistingChat(chats, vehicleId, publisherId);

  if (!existingChat) {
    const createResponse = await chatService.create({
      participants: [publisherId],
      vehicle_id: vehicleId,
      chat_type: CHAT_TYPE.INDIVIDUAL,
    });

    if (createResponse.status === 409) {
      chats = await fetchAllChats();
      existingChat = findExistingChat(chats, vehicleId, publisherId);
    } else if (!createResponse.ok || !createResponse.data) {
      throw new Error(createResponse.message || "No se pudo crear el chat");
    } else {
      existingChat = {
        id: createResponse.data.id,
        chat_type: createResponse.data.chat_type,
        vehicle_id: createResponse.data.vehicle_id,
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
    throw new Error("No se encontró el chat del vehículo");
  }

  const content = message?.trim() || DEFAULT_CONTACT_MESSAGE;

  const messageResponse = await chatService.sendMessage(existingChat.id, {
    content,
    type: CHAT_MESSAGE_TYPE.TEXT,
  });

  if (!messageResponse.ok) {
    throw new Error(messageResponse.message || "No se pudo enviar el mensaje");
  }

  return { chat_id: existingChat.id };
};
