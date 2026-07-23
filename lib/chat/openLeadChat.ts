import type { ChatListItem } from "@/interfaces/chat.interface";
import { CHAT_TYPE } from "@/interfaces/chat.interface";
import { chatService } from "@/services/chatService";

interface OpenLeadChatParams {
  vehicleId: string;
  buyerProfileId: string;
}

const findExistingChat = (
  chats: ChatListItem[],
  vehicleId: string,
  buyerProfileId: string,
): ChatListItem | undefined =>
  chats.find(
    (chat) =>
      chat.vehicle_id === vehicleId &&
      chat.other_participants.some((participant) => participant.id === buyerProfileId),
  );

const fetchAllChats = async (): Promise<ChatListItem[]> => {
  const response = await chatService.findAll({ page: 1, limit: 100 });
  if (!response.ok || !response.data) {
    throw new Error(response.message || "No se pudieron cargar los chats");
  }
  return response.data.data;
};

/** Abre o reutiliza el chat vendedor ↔ comprador de un lead (sin mensaje automático). */
export const openLeadChat = async ({
  vehicleId,
  buyerProfileId,
}: OpenLeadChatParams): Promise<{ chatId: string }> => {
  let chats = await fetchAllChats();
  let existingChat = findExistingChat(chats, vehicleId, buyerProfileId);

  if (!existingChat) {
    const createResponse = await chatService.create({
      participants: [buyerProfileId],
      vehicle_id: vehicleId,
      chat_type: CHAT_TYPE.INDIVIDUAL,
    });

    if (createResponse.status === 409) {
      chats = await fetchAllChats();
      existingChat = findExistingChat(chats, vehicleId, buyerProfileId);
    } else if (!createResponse.ok || !createResponse.data) {
      throw new Error(createResponse.message || "No se pudo crear el chat");
    } else {
      return { chatId: createResponse.data.id };
    }
  }

  if (!existingChat) {
    throw new Error("No se encontró el chat del lead");
  }

  return { chatId: existingChat.id };
};
