import type { Metadata } from "next";

import ForgotPasswordForm from "@/app/(auth)/components/ForgotPasswordForm";
import { getAutenticacionContenido } from "@/app/(auth)/services/autenticacionService";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getAutenticacionContenido("olvide_contrasena");
  return buildStrapiMetadata({ seo: content.seo, path: "/olvide-contrasena" });
}

export default async function Page() {
  const props = await getAutenticacionContenido("olvide_contrasena");

  return (
    <>
      <StrapiStructuredData seo={props.content.seo} />
      <ForgotPasswordForm {...props} />
    </>
  );
}
