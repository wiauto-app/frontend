"use client";

import { AssistantChatProvider } from "./assistantChatProvider";
import { AssistantDialog } from "./assistantDialog";

/** Provider + diálogo flotante; se carga en un chunk aparte del layout raíz. */
export const AssistantChatBundle = () => {
  return (
    <AssistantChatProvider>
      <AssistantDialog />
    </AssistantChatProvider>
  );
};
