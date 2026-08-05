import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { EditarVehiculoProfesionalContent } from "./EditarVehiculoProfesionalContent";

export const metadata = createUserAreaMetadata(
  "Edición completa del vehículo",
  "Edita todos los datos de tu anuncio profesional en un solo formulario.",
);

export default function EditarVehiculoProfesionalPage() {
  return <EditarVehiculoProfesionalContent />;
}
