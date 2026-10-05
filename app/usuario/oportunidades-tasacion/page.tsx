import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";

import { AppraisalOpportunitiesList } from "./components/AppraisalOpportunitiesList";

export const metadata = createUserAreaMetadata(
  "Oportunidades de tasación",
  "Coches tasados por particulares que buscan ofertas de concesionarios.",
);

export default function OportunidadesTasacionPage() {
  return <AppraisalOpportunitiesList />;
}
