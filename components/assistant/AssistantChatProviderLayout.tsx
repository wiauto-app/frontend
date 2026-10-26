"use client";

import type { ReactNode } from "react";

import { AssistantChatProvider } from "./assistantChatProvider";

interface AssistantChatProviderLayoutProps {
  children: ReactNode;
}

export const AssistantChatProviderLayout = ({
  children,
}: AssistantChatProviderLayoutProps) => {
  return <AssistantChatProvider>{children}</AssistantChatProvider>;
};
