import { getTasadorContent } from "@/app/(public)/tasador/services/getTasadorContent";
import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";

import { MyAppraisalDetail } from "../components/MyAppraisalDetail";

export const metadata = createUserAreaMetadata(
  "Detalle de tasación",
  "Valor estimado de tu coche y ofertas de concesionarios.",
);

interface MiTasacionPageProps {
  params: Promise<{ id: string }>;
}

export default async function MiTasacionPage({ params }: MiTasacionPageProps) {
  const [{ id }, content] = await Promise.all([params, getTasadorContent()]);

  return <MyAppraisalDetail id={id} content={content} />;
}
