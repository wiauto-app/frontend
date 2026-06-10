import { Suspense } from "react";

import { ChatPanel } from "@/components/chat/ChatPanel";

export default function MensajesPage() {
  return (
    <Suspense>
      <ChatPanel />
    </Suspense>
  );
}
