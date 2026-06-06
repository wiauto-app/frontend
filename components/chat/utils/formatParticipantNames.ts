import type { ChatParticipantSummary } from "@/interfaces/chat.interface";

const buildFullName = (participant: ChatParticipantSummary): string => {
  const fullName = `${participant.name ?? ""} ${participant.last_name ?? ""}`.trim();
  if (fullName.length > 0) {
    return fullName;
  }
  if (participant.email?.trim()) {
    return participant.email.trim();
  }
  return "Usuario";
};

export const formatParticipantNames = (
  participants: ChatParticipantSummary[],
): string => {
  if (participants.length === 0) {
    return "Sin participantes";
  }
  return participants.map(buildFullName).join(", ");
};
