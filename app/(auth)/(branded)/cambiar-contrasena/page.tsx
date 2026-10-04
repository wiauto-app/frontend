import type { Metadata } from "next";

import ChangePasswordForm from "@/app/(auth)/components/ChangePasswordForm";
import { ChangePasswordInvalidLink } from "@/app/(auth)/components/ChangePasswordInvalidLink";
import { getAutenticacionContenido } from "@/app/(auth)/services/autenticacionService";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getAutenticacionContenido("cambiar_contrasena");
  return buildStrapiMetadata({ seo: content.seo, path: "/cambiar-contrasena" });
}

interface CambiarContrasenaPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Page({ searchParams }: CambiarContrasenaPageProps) {
  const [{ token }, props] = await Promise.all([
    searchParams,
    getAutenticacionContenido("cambiar_contrasena"),
  ]);
  const reset_token = token?.trim() ?? "";

  return (
    <>
      <StrapiStructuredData seo={props.content.seo} />
      {reset_token ? (
        <ChangePasswordForm {...props} token={reset_token} />
      ) : (
        <ChangePasswordInvalidLink {...props} />
      )}
    </>
  );
}
