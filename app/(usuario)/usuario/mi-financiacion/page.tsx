import { Suspense } from "react";

import { RequireSubscription } from "@/components/billing/RequireSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";

import { DealershipFinancingSettingsContent } from "./components/DealershipFinancingSettingsContent";

export const metadata = createUserAreaMetadata(
  "Mi financiación",
  "Configura las condiciones de financiación que ofreces en los vehículos de tu concesionario.",
);

export default function MiFinanciacionPage() {
  return (
    <RequireSubscription>
      <Suspense fallback={<LoadingComponent />}>
        <Card size="sm">
          <CardContent>
            <DealershipFinancingSettingsContent />
          </CardContent>
        </Card>
      </Suspense>
    </RequireSubscription>
  );
}
