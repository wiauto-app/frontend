import { getTasadorContent } from "@/app/(public)/tasador/services/getTasadorContent";
import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";

import { AppraisalOpportunityDetail } from "../components/AppraisalOpportunityDetail";

export const metadata = createUserAreaMetadata(
  "Oportunidad de tasación",
  "Revisa el coche y envía tu oferta de compra.",
);

interface OportunidadPageProps {
  params: Promise<{ id: string }>;
}

export default async function OportunidadPage({ params }: OportunidadPageProps) {
  const [{ id }, content] = await Promise.all([params, getTasadorContent()]);

  return <AppraisalOpportunityDetail id={id} resultado={content.resultado} />;
}
