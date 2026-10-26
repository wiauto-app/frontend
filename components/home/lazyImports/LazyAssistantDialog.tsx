"use client";
import dynamic from "next/dynamic";

export const AssistantDialog = dynamic(
  () =>
    import("@/components/assistant/assistantDialog").then(
      (mod) => mod.AssistantDialog,
    ),
  {
    ssr: false,
  },
);

export const LazyAssistantDialog = () => {
  return <AssistantDialog />;
};
