import type { Metadata } from "next";

import { TwoFactorVerificationView } from "@/app/(auth)/components/TwoFactorVerificationView";
import { getAutenticacionContenido } from "@/app/(auth)/services/autenticacionService";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getAutenticacionContenido("verificacion_2fa");
  return buildStrapiMetadata({ seo: content.seo, path: "/verificacion-2fa" });
}

export default async function Page() {
  const [verificacion, login] = await Promise.all([
    getAutenticacionContenido("verificacion_2fa"),
    getAutenticacionContenido("login"),
  ]);

  return (
    <>
      <StrapiStructuredData seo={verificacion.content.seo} />
      <TwoFactorVerificationView
        {...verificacion}
        mensajesLogin={login.content.mensajes}
      />
    </>
  );
}
