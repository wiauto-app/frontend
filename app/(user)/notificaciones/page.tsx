import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { NotificacionesContent } from "./components/NotificacionesContent";

export const metadata = createUserAreaMetadata(
  "Notificaciones",
  "Configura canales y tipos de alertas de tu cuenta.",
);

export default function NotificacionesPage() {
  return <NotificacionesContent />;
}
