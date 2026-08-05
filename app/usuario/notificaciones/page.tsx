import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { NotificacionesContent } from "./components/NotificacionesContent";

export const metadata = createUserAreaMetadata(
  "Notificaciones",
  "Configura canales, tipos de alertas e inbox in-app de tu cuenta.",
);

export default function NotificacionesPage() {
  return <NotificacionesContent />;
}
