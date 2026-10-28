import type { Metadata } from "next";

import ConfirmEmailForm from "@/app/(auth)/components/ConfirmEmailForm";
import { ReferralAfterRegisterPrompt } from "@/components/referrals/ReferralAfterRegisterPrompt";
import { getAutenticacionContenido } from "@/app/(auth)/services/autenticacionService";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

interface ConfirmarCorreoPageProps {
  searchParams: Promise<{ anuncio?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getAutenticacionContenido("confirmar_correo");
  return buildStrapiMetadata({ seo: content.seo, path: "/confirmar-correo" });
}

export default async function Page({ searchParams }: ConfirmarCorreoPageProps) {
  const [props, params] = await Promise.all([
    getAutenticacionContenido("confirmar_correo"),
    searchParams,
  ]);

  return (
    <>
      <StrapiStructuredData seo={props.content.seo} />
      <ConfirmEmailForm {...props} hasPendingListing={params.anuncio === "1"} />
      <ReferralAfterRegisterPrompt />
    </>
  );
}
