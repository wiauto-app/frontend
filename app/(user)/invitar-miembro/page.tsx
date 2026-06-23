import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { InviteMemberPageContent } from "./components/InviteMemberPageContent";

export const metadata = createUserAreaMetadata(
  "Invitar miembro",
  "Invita a un nuevo miembro al equipo de tu concesionario.",
);

export default function InvitarMiembroPage() {
  return <InviteMemberPageContent />;
}
