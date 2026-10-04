import { Suspense } from "react";
import type { Metadata } from "next";

import RegisterForm from "@/app/(auth)/components/RegisterForm";
import { getAutenticacionContenido } from "@/app/(auth)/services/autenticacionService";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getAutenticacionContenido("registro");
  return buildStrapiMetadata({ seo: content.seo, path: "/registro" });
}

export default async function Page() {
  const props = await getAutenticacionContenido("registro");

  return (
    <>
      <StrapiStructuredData seo={props.content.seo} />
      <Suspense
        fallback={
          <div className="h-96 w-full animate-pulse rounded-lg bg-gray-100" />
        }
      >
        <RegisterForm {...props} />
      </Suspense>
    </>
  );
}
