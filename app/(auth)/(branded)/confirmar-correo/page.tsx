import type { Metadata } from "next";

import ConfirmEmailForm from "@/app/(auth)/components/ConfirmEmailForm";
import { getAutenticacionContenido } from "@/app/(auth)/services/autenticacionService";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getAutenticacionContenido("confirmar_correo");
  return buildStrapiMetadata({ seo: content.seo, path: "/confirmar-correo" });
}

export default async function Page() {
  const props = await getAutenticacionContenido("confirmar_correo");

  return (
    <>
      <StrapiStructuredData seo={props.content.seo} />
      <ConfirmEmailForm {...props} />
    </>
  );
}
