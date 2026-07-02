"use client";

import { useMemo } from "react";
import { useAssistantChat } from "../assistantChatProvider";
import { extractLatestSearchVehicles } from "../utils/extractLatestSearchVehicles";

export const useAssistantSearchResults = () => {
  const { messages, isConversationLoading } = useAssistantChat();

  const results = useMemo(
    () => extractLatestSearchVehicles(messages),
    [messages],
  );

  return {
    results,
    isLoading: isConversationLoading,
    hasResults: results !== null,
  };
};
