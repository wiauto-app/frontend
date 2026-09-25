import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ProactiveAlertsSettingsContent } from "./components/ProactiveAlertsSettingsContent";

export const metadata = createUserAreaMetadata(
  "Alertas proactivas",
  "Configura qué avisos automáticos recibes sobre tus anuncios y contactos.",
);

export default function AlertasProactivasPage() {
  return <ProactiveAlertsSettingsContent />;
}
