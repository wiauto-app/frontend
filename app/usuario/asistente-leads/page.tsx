import { Suspense } from "react";

import { RequireSubscription } from "@/components/billing/RequireSubscription";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";

import { LeadAssistantSettingsContent } from "./components/LeadAssistantSettingsContent";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createUserAreaMetadata(
  "Asistente de leads",
  "Configura respuestas automáticas en tus chats cuando no estés en la conversación.",
);

export default function AsistenteLeadsPage() {
  return (
    <RequireSubscription>
      <Suspense fallback={<LoadingComponent />}>
        <Card size="sm">
          <CardContent>
            <LeadAssistantSettingsContent />
          </CardContent>
        </Card>
      </Suspense>
    </RequireSubscription>
  );
}
