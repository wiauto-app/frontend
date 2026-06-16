import { Suspense } from "react";
import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ChatPanel } from "@/components/chat/ChatPanel";

export const metadata = createUserAreaMetadata(
  "Mensajes",
  "Gestiona tus conversaciones con compradores y vendedores.",
);

export default function MensajesPage() {
  return (
    <Suspense>
      <ChatPanel />
    </Suspense>
  );
}
