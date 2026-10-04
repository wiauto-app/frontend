import type { Metadata } from "next";

import LoginForm from "@/app/(auth)/components/LoginForm";
import { getAutenticacionContenido } from "@/app/(auth)/services/autenticacionService";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getAutenticacionContenido("login");
  return buildStrapiMetadata({ seo: content.seo, path: "/iniciar-sesion" });
}

export default async function Page() {
  const [login, verificacion] = await Promise.all([
    getAutenticacionContenido("login"),
    getAutenticacionContenido("verificacion_2fa"),
  ]);

  return (
    <>
      <StrapiStructuredData seo={login.content.seo} />
      <LoginForm {...login} contentVerificacion={verificacion.content} />
    </>
  );
}
