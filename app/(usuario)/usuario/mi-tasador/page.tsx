import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";

import { MyAppraisalsList } from "./components/MyAppraisalsList";

export const metadata = createUserAreaMetadata(
  "Mis tasaciones",
  "Consulta tus tasaciones y las ofertas de los concesionarios.",
);

export default function MiTasadorPage() {
  return <MyAppraisalsList />;
}
